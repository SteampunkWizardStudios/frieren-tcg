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
    const userPromises = top10.map((playerObject) =>
      interaction.client.users
        .fetch(playerObject.player.discordId)
        .then((user) => user?.displayName ?? "Unknown User")
        .catch(() => "Unknown User")
    );
    const usernames = await Promise.all(userPromises);
    const usernamePoints = usernames.map((username, index) => ({
      username: username,
      points: top10[index]?.masteryPoints ?? 0,
    }));

    await interaction.editReply({
      embeds: [
        await leaderboardEmbed({
          usernamePoints,
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
