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
    const idsToPoints = top10.map(({ player, rankPoints }) => ({
      id: player.discordId,
      points: rankPoints,
    }));

    await interaction.editReply({
      embeds: [
        await leaderboardEmbed({
          idsToPoints,
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
