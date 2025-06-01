import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageType,
  PrivateThreadChannel,
  PublicThreadChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
  User,
  Message,
  MessageFlags,
} from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { tcgMain } from "@src/tcgMain";
import {
  handleDatabaseOperations,
  DatabaseOperationResult,
} from "./handleDatabaseOperations";
import buildBattleResults from "@src/ui/battleResults";
import sendMoveThreadMessage from "./utils/sendMoveThreadMessage";

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

      sendMoveThreadMessage(gameThread, challenger);
      sendMoveThreadMessage(gameThread, opponent);

      const gameRes = await tcgMain(
        challenger,
        opponent,
        gameThread,
        challengerThread,
        opponentThread,
        gameSettings,
        textSpeedMs
      );

      const { winner, loser, winnerCharacter, loserCharacter } = gameRes;

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

      let dbRes: DatabaseOperationResult | null = null;

      // handle database operations
      if (winner && winnerCharacter && loser && loserCharacter && gameMode) {
        try {
          dbRes = await handleDatabaseOperations({
            winner,
            winnerCharacter,
            loser,
            loserCharacter,
            ranked,
            gameMode,
            gameThread,
          });
        } catch (error) {
          console.error(
            `Error in database operation calculation for Winner UserID ${winner.id} vs Loser UserID ${loser.id}`
          );
          console.error(error); // just log and continue
        }
      }

      const container = buildBattleResults({
        gameRes: { ...gameRes, challenger, opponent },
        dbRes,
        threadId: gameThread.id,
      });

      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        reply: { messageReference: gameId },
      });
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
