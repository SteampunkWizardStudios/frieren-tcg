import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageType,
  PrivateThreadChannel,
  PublicThreadChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
  User,
  Message,
} from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { tcgMain } from "@src/tcgMain";
import { handleDatabaseOperationsWithResultEmbedSideEffect } from "./handleDatabaseOperations";
import { charWithEmoji } from "@tcg/formatting/emojis";

export const initiateGame = async (
  interaction: ChatInputCommandInteraction,
  addThreadFunc: (threadId?: string | undefined) => Promise<Message<boolean>>,
  gameId: string,
  challenger: User,
  opponent: User,
  gameSettings: GameSettings,
  ranked: boolean,
  textSpeedMs: number,
  gameMode?: GameMode
) => {
  try {
    const channel = await interaction.client.channels.fetch(
      interaction.channelId
    );

    if (channel && channel instanceof TextChannel) {
      const gameThread = (await channel.threads.create({
        name: `${ranked ? "Ranked " : ""}TCG Game Thread: ${challenger.displayName} vs ${opponent.displayName} (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      })) as PublicThreadChannel<false>;
      await Promise.all([
        gameThread.members.add(challenger.id),
        gameThread.members.add(opponent.id),
      ]);

      addThreadFunc(gameThread.id).catch((error) => {
        console.error("Failed to add thread link:", error);
      });

      (async () => {
        try {
          const messages = await channel.messages.fetch({
            limit: 10,
            after: gameId,
          });
          const systemMessage = messages.find(
            (msg) =>
              msg.type === MessageType.ThreadCreated &&
              msg.author.id === interaction.client.user.id
          );

          if (systemMessage) {
            await systemMessage.delete();
          }
        } catch (error) {
          console.error("Failed to delete system message:", error);
        }
      })();

      const challengerThread = (await channel.threads.create({
        name: `TCG Move Select: ${challenger.displayName}'s Move Selection Thread (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: ChannelType.PrivateThread,
      })) as PrivateThreadChannel;
      await challengerThread.members.add(challenger.id);

      const opponentThread = (await channel.threads.create({
        name: `TCG Move Select: ${opponent.displayName}'s Move Selection Thread (ID: ${gameId})`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: gameSettings.publicChallengedThread
          ? ChannelType.PublicThread
          : ChannelType.PrivateThread,
      })) as ThreadChannel;
      await opponentThread.members.add(opponent.id);

      const {
        winner,
        winnerCharacter,
        loser,
        loserCharacter,
        challengerCharacter,
        opponentCharacter,
      } = await tcgMain(
        challenger,
        opponent,
        gameThread,
        challengerThread,
        opponentThread,
        gameSettings,
        textSpeedMs
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

      const challengerCharFormatted = challengerCharacter
        ? charWithEmoji(challengerCharacter)
        : "Unselected";
      const opponentCharFormatted = opponentCharacter
        ? charWithEmoji(opponentCharacter)
        : "Unselected";

      let resultEmbed = new EmbedBuilder()
        .setColor(0xc5c3cc)
        .setTitle(
          `Frieren TCG - Results: ${challenger.displayName} vs ${opponent.displayName}`
        )
        .setFields({
          name: "Characters",
          value: `${challenger} as ${challengerCharFormatted}\n${opponent} as ${opponentCharFormatted}`,
        })
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
              gameThread,
            }
          );
        } catch (error) {
          console.error(
            `Error in database operation calculation for Winner UserID ${winner.id} vs Loser UserID ${loser.id}`
          );
          console.error(error); // just log and continue
        }
      }

      if (winner && loser) {
        await channel.send({
          embeds: [
            resultEmbed.setDescription(
              `Game over! ${winner} defeated ${loser}!`
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
          "The application doesn't have permission to create threads in this channel, or the channel doesn't support threads.",
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
