import {
  ChatInputCommandInteraction,
  ContainerBuilder,
  TextDisplayBuilder,
} from "discord.js";
import { CHARACTER_MAP } from "@tcg/characters/characterList";
import prismaClient from "@prismaClient";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@src/tcg/formatting/emojis";

export default async function handleUsageStats(
  interaction: ChatInputCommandInteraction
) {
  const data = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
    },
    select: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
    },
  });

  const usageMap = Object.entries(CHARACTER_MAP).reduce(
    (map, [, character]) => {
      map[character.name] = {
        wins: 0,
        losses: 0,
      };
      return map;
    },
    {} as Record<string, { wins: number; losses: number }>
  );

  data.forEach((match) => {
    usageMap[match.winnerCharacter.name].wins++;
    usageMap[match.loserCharacter.name].losses++;
  });

  const component = makeComponent(usageMap);

  await interaction.editReply({
    components: [component],
    flags: "IsComponentsV2",
  });
}

function makeComponent(
  usage: Record<CharacterName, { wins: number; losses: number }>
) {
  const totalMatches = Object.values(usage).reduce(
    (acc, stats) => acc + stats.wins + stats.losses,
    0
  );

  return new ContainerBuilder().addTextDisplayComponents(
    new TextDisplayBuilder().setContent("## Usage stats"),
    new TextDisplayBuilder().setContent(`### Total matches: ${totalMatches}`),
    ...Object.entries(usage).map(([name, stats]) => {
      const { wins, losses } = stats;
      const usage = Math.round(((wins + losses) / totalMatches) * 1000) / 10;

      return new TextDisplayBuilder().setContent(
        `${charWithEmoji(name as CharacterName)} matches: ${wins + losses}, usage: ${usage}%`
      );
    })
  );
}
