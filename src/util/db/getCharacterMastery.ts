import prismaClient from "../../../prisma/client";

export const getCharacterMastery = async (prop: {
  playerId: number;
  characterId: number;
}): Promise<{ id: number }> => {
  const { playerId, characterId } = prop;
  return prismaClient.characterMastery.upsert({
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
};

export const getCharacterMasteries = async (
  props: { playerId: number; characterId: number }[],
): Promise<{ id: number }[]> => {
  return prismaClient.$transaction(async (_tx) => {
    return Promise.all(props.map((prop) => getCharacterMastery(prop)));
  });
};
