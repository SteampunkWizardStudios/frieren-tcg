import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import { getLatestLadderReset } from "@src/util/db/getLatestLadderReset";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ComponentType,
  ButtonStyle,
} from "discord.js";
import { Prisma } from "@prisma/client";
import { capitalizeFirstLetter } from "@src/util/utils";
import leaderboardEmbed from "./leaderboardEmbed";
import {
  LazyPaginatedMessage,
  type PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { countPlayerMatches } from "@src/commands/tcgPlayer/playerHandlers/profileEmbed";
import querySeason, { SeasonQuery } from "@src/util/db/querySeason";

const PAGE_SIZE = 12;

export type LadderRankWithPlayer = Prisma.LadderRankGetPayload<{
  include: { player: true };
}>;

export const getTopNPlayersInGamemode = async function (
  gamemode: GameMode,
  count: number,
  seasonQuery: SeasonQuery | null = null
): Promise<LadderRankWithPlayer[] | null> {
  const currLadderReset = seasonQuery
    ? await prismaClient.ladderReset.findFirst({
        where: { ...seasonQuery, ladder: { name: gamemode } },
      })
    : await getLatestLadderReset({ gamemode });

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
  const season = interaction.options.getInteger("season");

  const top100 = await getTopNPlayersInGamemode(
    gamemode,
    100,
    season ? await querySeason(season) : null
  );
  if (!top100) {
    await interaction.editReply({
      content: "Failed to fetch Global Leaderboard.",
    });
    return;
  }

  const currLadderReset = season
    ? await prismaClient.ladderReset.findFirst({
        where: { ...(await querySeason(season)), ladder: { name: gamemode } },
      })
    : await getLatestLadderReset({ gamemode });

  if (!currLadderReset) {
    await interaction.editReply({
      content: "Failed to fetch ladder reset.",
    });
    return;
  }

  const idsToPoints = await Promise.all(
    top100.map(async (entry) => {
      const { wins, losses } = await countPlayerMatches(
        entry.player.id,
        currLadderReset.id
      );

      return {
        id: entry.player.discordId,
        points: entry.rankPoints,
        wins,
        losses,
      };
    })
  );

  const totalPages = Math.ceil(idsToPoints.length / PAGE_SIZE);

  const pages = Array.from({ length: totalPages }, (_, i) => async () => {
    const pageData = idsToPoints.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    const embed = leaderboardEmbed({
      idsToPoints: pageData,
      leaderboard: capitalizeFirstLetter(gamemode),
      isCharacterLeaderboard: false,
      page: i + 1,
      pageSize: PAGE_SIZE,
    });

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  if (pages.length === 0) {
    const leaderboardTitle = `${capitalizeFirstLetter(gamemode)} Ranked Global Leaderboard`;
    const noPlayersFoundEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(leaderboardTitle)
      .setDescription(
        "No players found in this leaderboard. Maybe you could be the first one?"
      );

    await interaction.editReply({
      embeds: [noPlayersFoundEmbed],
    });
    return;
  }

  const paginated = new LazyPaginatedMessage({ pages });
  // you can change the message settings here
  paginated.actions.forEach((action) => {
    if (action.type === ComponentType.Button) {
      action.style = ButtonStyle.Secondary;
    }
  });
  await paginated.run(interaction);
}
