import prismaClient from "@prismaClient";
import { getOrCreateCharacters } from "@src/util/db/getCharacter";
import { ChatInputCommandInteraction } from "discord.js";
import { Prisma } from "@prisma/client";
import { capitalizeFirstLetter } from "@src/util/utils";
import leaderboardEmbed from "./leaderboardEmbed";
import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";

export type CharacterMasteryWithPlayer = Prisma.CharacterMasteryGetPayload<{
  include: { player: true };
}>;

const getTopNPlayersPerCharacter = async function (
  character: CharacterName,
  count: number
): Promise<CharacterMasteryWithPlayer[] | null> {
  const characterObject = (await getOrCreateCharacters([character]))[0];
  if (characterObject) {
    const topN = await prismaClient.characterMastery.findMany({
      where: { characterId: characterObject.id },
      orderBy: { masteryPoints: "desc" },
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

export async function handleCharacterGlobalStats(
  interaction: ChatInputCommandInteraction
) {
  const character: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;
  const top10 = await getTopNPlayersPerCharacter(character, 10);

  if (top10) {
    const idsToPoints = top10.map(({ player, masteryPoints }) => ({
      id: player.discordId,
      points: masteryPoints,
    }));

    await interaction.editReply({
      embeds: [
        await leaderboardEmbed({
          idsToPoints,
          leaderboard: capitalizeFirstLetter(character),
          isCharacterLeaderboard: true,
        }),
      ],
    });
  } else {
    await interaction.editReply({
      content: `Failed to fetch Global Character Leaderboard for Character ${capitalizeFirstLetter(character)}`,
    });
  }
}
