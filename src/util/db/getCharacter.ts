import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import prismaClient from "../../../prisma/client";

export const getOrCreateCharacters = async (
  characterNames: CharacterName[],
): Promise<({ id: number; name: string } | null)[]> => {
  return prismaClient.$transaction(async (tx) => {
    return await Promise.all(
      characterNames.map((characterName) => {
        return tx.character.upsert({
          where: {
            name: characterName,
          },
          update: {},
          create: {
            name: characterName,
          },
        });
      }),
    );
  });
};
