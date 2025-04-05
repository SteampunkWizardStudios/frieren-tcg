import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PrivateThreadChannel,
  PublicThreadChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
  User,
} from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { tcgMain } from "../../../tcgMain";
import { handleDatabaseOperationsWithResultEmbedSideEffect } from "./handleDatabaseOperations";

export const initiateGame = async (
  interaction: ChatInputCommandInteraction,
  gameId: string,
  challenger: User,
  opponent: User,
  gameSettings: GameSettings,
  ranked: boolean,
  gameMode?: GameMode,
) => {
  try {
    const channel = (await interaction.client.channels.fetch(
      interaction.channelId,
    )) as TextChannel;

    if (channel) {
      const gameThread = (await channel.threads.create({
        name: `${ranked ? "Ranked " : ""}TCG Game Thread: ${challenger.username} vs ${opponent.username} (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: ChannelType.PublicThread,
      })) as PublicThreadChannel<false>;
      await gameThread.members.add(challenger.id);
      await gameThread.members.add(opponent.id);

      const challengerThread = (await channel.threads.create({
        name: `TCG Move Select: ${challenger.username}'s Move Selection Thread (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: ChannelType.PrivateThread,
      })) as PrivateThreadChannel;
      await challengerThread.members.add(challenger.id);

      const opponentThread = (await channel.threads.create({
        name: `TCG Move Select: ${opponent.username}'s Move Selection Thread (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: gameSettings.publicChallengedThread
          ? ChannelType.PublicThread
          : ChannelType.PrivateThread,
      })) as ThreadChannel;
      await opponentThread.members.add(opponent.id);

      const { winner, winnerCharacter, loser, loserCharacter } = await tcgMain(
        challenger,
        opponent,
        gameThread,
        challengerThread,
        opponentThread,
        gameSettings,
      );

      // thread cleanup
      await Promise.all([
        gameThread.setArchived(true, "Game completed."),
        gameThread.members.remove(challenger.id),
        gameThread.members.remove(opponent.id),
        challengerThread.setArchived(true, "Game completed."),
        challengerThread.members.remove(challenger.id),
        opponentThread.setArchived(true, "Game completed."),
        opponentThread.members.remove(opponent.id),
      ]);

      let resultEmbed = new EmbedBuilder()
        .setColor(0xc5c3cc)
        .setTitle(
          `Frieren TCG - Results: ${challenger.username} vs ${opponent.username}`,
        )
        .setFooter({
          text: `Game ID: ${gameId}`,
        });

      // handle database operations
      if (winner && winnerCharacter && loser && loserCharacter && gameMode) {
        try {
          resultEmbed = await handleDatabaseOperationsWithResultEmbedSideEffect(
            {
              winner,
              winnerCharacter,
              loser,
              loserCharacter,
              ranked,
              gameMode,
              resultEmbed,
            },
          );
        } catch (error) {
          console.error(
            `Error in database operation calculation for Winner UserID ${winner.id} vs Loser UserID ${loser.id}`,
          );
          console.error(error); // just log and continue
        }
      }

      if (winner && loser) {
        await channel.send({
          embeds: [
            resultEmbed.setDescription(
              `Game over! ${winner} defeated ${loser}!`,
            ),
          ],
          reply: { messageReference: gameId },
        });
      } else {
        await channel.send({
          embeds: [
            resultEmbed.setDescription(`Game over! The game ended in a tie!`),
          ],
          reply: { messageReference: gameId },
        });
      }
    } else {
      await interaction.editReply({
        content:
          "The application doesn't have permission to create threads in this channel.",
        embeds: [],
        components: [],
      });
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: "An error occurred while initiating the game.",
      embeds: [],
      components: [],
    });
  }
};
