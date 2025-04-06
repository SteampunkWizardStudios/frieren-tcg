import prismaClient from "../../../prisma/client";

export const getCharacterMasteries = async (
  props: { playerId: number; characterId: number }[]
): Promise<{ id: number }[]> => {
  return prismaClient.$transaction(async (tx) => {
    return await Promise.all(
      props.map((prop) => {
        const { playerId, characterId } = prop;

        return tx.characterMastery.upsert({
          where: {
            playerId_characterId: {
              playerId,
              characterId,
            },
          },
          update: {},
          create: {
            playerId,
            characterId,
          },
        });
      })
    );
  });
};
