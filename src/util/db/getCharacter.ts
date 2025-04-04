import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import prismaClient from "../../../prisma/client";

export const getCharacter = async (
  characterName: CharacterName,
): Promise<{ id: number; name: string } | null> => {
  return prismaClient.character.findUnique({
    where: {
      name: characterName,
    },
  });
};

export const getCharacters = async (
  characterNames: CharacterName[],
): Promise<({ id: number; name: string } | null)[]> => {
  return prismaClient.$transaction(async (_tx) => {
    return Promise.all(characterNames.map((name) => getCharacter(name)));
  });
};
