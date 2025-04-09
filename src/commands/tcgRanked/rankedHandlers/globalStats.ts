import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import { getLatestLadderReset } from "@src/util/db/getLatestLadderReset";
import { ChatInputCommandInteraction } from "discord.js";
import { Prisma } from "@prisma/client";
import { capitalizeFirstLetter } from "@src/util/utils";
import leaderboardEmbed from "./leaderboardEmbed";

export type LadderRankWithPlayer = Prisma.LadderRankGetPayload<{
  include: { player: true };
}>;

const getTopNPlayersInGamemode = async function (
  gamemode: GameMode,
  count: number
): Promise<LadderRankWithPlayer[] | null> {
  const currLadderReset = await getLatestLadderReset({ gamemode });

  if (currLadderReset) {
    const topN = await prismaClient.ladderRank.findMany({
      where: { ladderResetId: currLadderReset.id },
      orderBy: { rankPoints: "desc" },
      take: count,
      include: {
        player: true,
      },
    });

    return topN;
  } else {
    return null;
  }
};

export async function handleGlobalStats(
  interaction: ChatInputCommandInteraction
) {
  const gamemode: GameMode =
    (interaction.options.getString("gamemode") as GameMode) ?? GameMode.CLASSIC;
  const top10 = await getTopNPlayersInGamemode(gamemode, 10);

  if (top10) {
    const userPromises = top10.map((playerObject) =>
      interaction.client.users
        .fetch(playerObject.player.discordId)
        .then((user) => user?.displayName ?? "Unknown User")
        .catch(() => "Unknown User")
    );
    const usernames = await Promise.all(userPromises);
    const usernamePoints = usernames.map((username, index) => ({
      username: username,
      points: top10[index]?.rankPoints ?? 0,
    }));

    await interaction.editReply({
      embeds: [
        await leaderboardEmbed({
          usernamePoints,
          leaderboard: capitalizeFirstLetter(gamemode),
          isCharacterLeaderboard: false,
        }),
      ],
    });
  } else {
    await interaction.editReply({
      content: "Failed to fetch Global Leaderboard.",
    });
  }
}
