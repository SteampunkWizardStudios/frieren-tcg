import { ChatInputCommandInteraction, ContainerBuilder } from "discord.js";
import { CHARACTER_MAP } from "@tcg/characters/characterList";
import prismaClient from "@prismaClient";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";

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

  const usageMap = Object.entries(CHARACTER_MAP).forEach(([, character]) => {
    usageMap[character.name] = {
      wins: 0,
      losses: 0,
    };
  }, {} as Record<CharacterName, { wins: number; losses: number }>);;

  data.forEach((match) => {
    usageMap[match.winnerCharacter.name].wins++;
    usageMap[match.loserCharacter.name].losses++;
  });

  const component = makeComponent();

  await interaction.editReply({
    components: [component],
    flags: "IsComponentsV2",
  });
}

function makeComponent() {
  return new ContainerBuilder();
}
