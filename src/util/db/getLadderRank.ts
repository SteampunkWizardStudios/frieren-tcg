import prismaClient from "../../../prisma/client";

export const getLadderRanks = async (
  props: { playerId: number; ladderResetId: number }[],
): Promise<{ id: number; rankPoints: number }[]> => {
  return prismaClient.$transaction(async (tx) => {
    return await Promise.all(
      props.map((prop) => {
        const { playerId, ladderResetId } = prop;
        return tx.ladderRank.upsert({
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
      }),
    );
  });
};
