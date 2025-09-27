import prismaClient from "@/prisma/client";
import { SeasonQuery } from "@/src/util/db/querySeason";
import { getWinrate } from "@/src/util/utils";
import {
  LazyPaginatedMessage,
  PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { User, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { charWithEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export default async function handleVsCharacterRecordOverview(
  player: User,
  playerCharacter: string | null,
  interaction: ChatInputCommandInteraction,
  seasonQuery: SeasonQuery | null
) {
  const playerCharFilter = playerCharacter
    ? { name: playerCharacter }
    : undefined;
  const data = await prismaClient.match.findMany({
    where: {
      ladderReset: seasonQuery ?? { endDate: null },
      OR: [
        {
          winner: {
            discordId: player.id,
          },
          ...(playerCharFilter && { winnerCharacter: playerCharFilter }),
        },
        {
          loser: {
            discordId: player.id,
          },
          ...(playerCharFilter && { loserCharacter: playerCharFilter }),
        },
      ],
    },
    select: {
      winner: { select: { discordId: true } },
      loser: { select: { discordId: true } },
      winnerCharacter: { select: { name: true } },
      loserCharacter: { select: { name: true } },
    },
  });

  if (data.length === 0) {
    await interaction.editReply({
      content: `There are no records of this matchup in the selected ladder.`,
    });
    return;
  }

  const matchRecord: Record<string, { wins: number; losses: number }> = {};

  for (const match of data) {
    let enemyChar: string | undefined;
    let win = false;
    if (match.winner.discordId === player.id) {
      enemyChar = match.loserCharacter?.name;
      win = true;
    } else {
      enemyChar = match.winnerCharacter?.name;
      win = false;
    }
    if (!enemyChar) continue;
    if (!matchRecord[enemyChar]) {
      matchRecord[enemyChar] = { wins: 0, losses: 0 };
    }
    if (win) {
      matchRecord[enemyChar].wins += 1;
    } else {
      matchRecord[enemyChar].losses += 1;
    }
  }

  const records = Object.entries(matchRecord).map(([character, record]) => ({
    character,
    formattedCharacter: charWithEmoji(character as CharacterName),
    wins: record.wins,
    losses: record.losses,
    winrate: getWinrate(record.wins, record.losses).winrate,
  }));

  records.sort((a, b) => b.winrate - a.winrate);

  const pageSize = 24;
  const totalPages = Math.ceil(records.length / pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => {
    const pageData = records.slice(i * pageSize, (i + 1) * pageSize);

    const embed = new EmbedBuilder().setColor("Blurple");
    if (!playerCharacter) {
      embed.setTitle(`${player.displayName}'s Record Against Characters`);
    } else {
      embed.setTitle(
        `${player.displayName}'s Record Against Characters with ${charWithEmoji(playerCharacter as CharacterName)}`
      );
    }
    embed.setDescription(
      pageData
        .map(({ formattedCharacter, wins, losses, winrate }) => {
          return `**${formattedCharacter}**: ${wins} wins, ${losses} losses (Winrate: ${winrate}%)`;
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
