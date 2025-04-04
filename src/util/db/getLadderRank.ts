import prismaClient from "../../../prisma/client";

export const getLadderRank = async (prop: {
  playerId: number;
  ladderResetId: number;
}): Promise<{ id: number; rankPoints: number }> => {
  const { playerId, ladderResetId } = prop;
  return prismaClient.ladderRank.upsert({
    where: {
      ladderResetId_playerId: {
        playerId,
        ladderResetId,
      },
    },
    update: {},
    create: {
      playerId,
      ladderResetId,
    },
    select: {
      id: true,
      rankPoints: true,
    },
  });
};

export const getLadderRanks = async (
  props: { playerId: number; ladderResetId: number }[],
): Promise<{ id: number; rankPoints: number }[]> => {
  return prismaClient.$transaction(async (_tx) => {
    return Promise.all(props.map((prop) => getLadderRank(prop)));
  });
};
