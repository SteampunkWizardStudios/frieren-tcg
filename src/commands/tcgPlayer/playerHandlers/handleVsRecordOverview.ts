import prismaClient from "@/prisma/client";
import { getWinrate } from "@/src/util/utils";
import {
  LazyPaginatedMessage,
  PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { User, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default async function handleVsRecordOverview(
  player: User,
  interaction: ChatInputCommandInteraction
) {
  const data = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: player.id,
          },
        },
        {
          loser: {
            discordId: player.id,
          },
        },
      ],
    },
    select: {
      winner: true,
      loser: true,
    },
  });

  const matchRecord: Record<string, { wins: number; losses: number }> = {};

  for (const match of data) {
    const opponentDiscordId =
      match.winner.discordId === player.id
        ? match.loser.discordId
        : match.winner.discordId;

    if (!matchRecord[opponentDiscordId]) {
      matchRecord[opponentDiscordId] = { wins: 0, losses: 0 };
    }
    if (match.winner.discordId === player.id) {
      matchRecord[opponentDiscordId].wins += 1;
    } else {
      matchRecord[opponentDiscordId].losses += 1;
    }
  }

  const records = Object.entries(matchRecord).map(([opponentId, record]) => ({
    opponentId,
    wins: record.wins,
    losses: record.losses,
    winrate: getWinrate(record.wins, record.losses).winrate,
  }));

  records.sort((a, b) => b.winrate - a.winrate);

  const pageSize = 24;
  const totalPages = Math.ceil(records.length / pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => {
    const pageData = records.slice(i * pageSize, (i + 1) * pageSize);

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(`${player.displayName}'s Record Against Opponents`)
      .setDescription(
        pageData
          .map(({ opponentId, wins, losses, winrate }) => {
            return `<@${opponentId}>: ${wins} wins, ${losses} losses (Winrate: ${winrate}%)`;
          })
          .join("\n")
      );

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };
    return page;
  });

  const paginated = new LazyPaginatedMessage({ pages });

  await paginated.run(interaction);
}
