import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prismaClient from "@prismaClient";
import querySeason, {
  SeasonQuery,
} from "@src/util/db/querySeason";
import { CHARACTER_MAP } from "@tcg/characters/characterList";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export default async function handleBanRates(
  interaction: ChatInputCommandInteraction
) {
  const seasonId = interaction.options.getInteger("season");
  const seasonFilter: SeasonQuery | null = seasonId
    ? await querySeason(seasonId)
    : null;

  const characterBanWhere = {
    match: {
      ranked: true,
      ladderReset: seasonFilter ?? { endDate: null },
    },
  } as const;

  const [distinctMatchIds, groupedBans] = await Promise.all([
    prismaClient.characterBan.findMany({
      where: characterBanWhere,
      distinct: ["matchId"],
      select: {
        matchId: true,
      },
    }),
    prismaClient.characterBan.groupBy({
      by: ["characterId"],
      _count: {
        characterId: true,
      },
      where: characterBanWhere,
    }),
  ]);

  const totalMatchesWithBans = distinctMatchIds.length;

  if (totalMatchesWithBans === 0) {
    await interaction.editReply({
      content: "No ranked ban data available yet.",
    });
    return;
  }

  const characterIds = groupedBans.map((entry) => entry.characterId);
  const characters = await prismaClient.character.findMany({
    where: {
      id: {
        in: characterIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  const idToName = new Map<number, string>(
    characters.map((character) => [character.id, character.name])
  );

  const lines = groupedBans
    .map((entry) => {
      const name = idToName.get(entry.characterId) ?? "Unknown";
      const formattedName = formatCharacterName(name);
      const percentage = (entry._count.characterId / totalMatchesWithBans) * 100;
      return {
        formattedName,
        percentage,
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .map(({ formattedName, percentage }) => {
      return `${formattedName}: ${percentage.toFixed(1)}%`;
    });

  const description = lines.join("\n");

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle("Ranked Ban Rates")
    .setDescription(description)
    .setFooter({
      text: `Total ranked matches with bans: ${totalMatchesWithBans}`,
    });

  await interaction.editReply({
    content: "",
    embeds: [embed],
  });
}

function formatCharacterName(name: string): string {
  const characterName = name as CharacterName;
  const character = CHARACTER_MAP[characterName];
  if (character) {
    return `${character.cosmetic.emoji} ${character.characterName}`;
  }
  return name;
}
