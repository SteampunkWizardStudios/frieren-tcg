import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prismaClient from "@prismaClient";
import { characterNameToEmoji } from "@src/tcg/formatting/emojis";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";

export async function handleCharacterStats(
  interaction: ChatInputCommandInteraction
) {
  const character = interaction.options.getString("character", true);

  const data = await prismaClient.character.findUnique({
    where: { name: character },
    select: {
      winnerMatches: {
        where: {
          ladderReset: { endDate: null },
          loserCharacter: { name: { not: character } },
        },
        include: {
          loserCharacter: {
            select: { name: true },
          },
        },
      },
      loserMatches: {
        where: {
          ladderReset: { endDate: null },
          winnerCharacter: { name: { not: character } },
        },
        include: {
          winnerCharacter: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (!data) {
    await interaction.editReply({
      content: "Failed to fetch character stats.",
    });
    return;
  }

  // opponent name -> match history against opponent
  const matchRecord = new Map<string, { wins: number; losses: number }>();
  const overallStats = { wins: 0, losses: 0 };

  for (const match of data.winnerMatches) {
    const loserCharacter = match.loserCharacter.name;
    const record = matchRecord.get(loserCharacter) ?? { wins: 0, losses: 0 };

    record.wins++;
    overallStats.wins++;
    matchRecord.set(loserCharacter, record);
  }

  for (const match of data.loserMatches) {
    const winnerCharacter = match.winnerCharacter.name;
    const record = matchRecord.get(winnerCharacter) ?? { wins: 0, losses: 0 };

    record.losses++;
    overallStats.losses++;
    matchRecord.set(winnerCharacter, record);
  }

  const overallWinrate =
    (overallStats.wins / (overallStats.wins + overallStats.losses)) * 100;

  const formattedRecord = Array.from(matchRecord.entries())
    .sort(([, recordA], [, recordB]) => {
      const totalA = recordA.wins + recordA.losses;
      const totalB = recordB.wins + recordB.losses;
      const winRateA = totalA > 0 ? recordA.wins / totalA : 0;
      const winRateB = totalB > 0 ? recordB.wins / totalB : 0;

      return winRateB - winRateA;
    })
    .map(([opponent, record]) => {
      const emoji =
        characterNameToEmoji[opponent as keyof typeof characterNameToEmoji];
      const formattedEmoji = emoji ? `${emoji} ` : "";
      const { wins, losses } = record;
      const totalMatches = wins + losses;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
      return `${formattedEmoji}${opponent}: ${wins} Wins, ${losses} Losses, Winrate: ${winRate.toFixed(1)}%`;
    });

  const description = [
    `${overallStats.wins} Wins, ${overallStats.losses} Losses, Winrate: ${overallWinrate.toFixed(1)}%\n`,
    "Record against opponents",
    ...formattedRecord,
  ];

  const color = CHARACTER_LIST.find((char) => char.name === character)?.cosmetic
    .color;

  const embed = new EmbedBuilder()
    .setTitle(`Match Stats for ${character}`)
    .setColor(color ?? "Blurple")
    .setDescription(
      description.length > 0 ? description.join("\n") : "No matches found."
    );

  await interaction.editReply({
    embeds: [embed],
  });
}
