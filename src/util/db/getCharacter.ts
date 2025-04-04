import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import prismaClient from "../../../prisma/client";

export const getOrCreateCharacter = async (
  characterName: CharacterName,
): Promise<{ id: number; name: string } | null> => {
  return prismaClient.character.upsert({
    where: {
      name: characterName,
    },
    update: {},
    create: {
      name: characterName,
    },
  });
};

export const getOrCreateCharacters = async (
  characterNames: CharacterName[],
): Promise<({ id: number; name: string } | null)[]> => {
  return prismaClient.$transaction(async (_tx) => {
    return Promise.all(
      characterNames.map((name) => getOrCreateCharacter(name)),
    );
  });
};
