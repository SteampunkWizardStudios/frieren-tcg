import prismaClient from "../../../prisma/client";

export const createMatch = async (prop: {
  ladderResetId: number;
  winnerId: number;
  winnerCharacterId: number;
  loserId: number;
  loserCharacterId: number;
}): Promise<{ id: number }> => {
  const {
    ladderResetId,
    winnerId,
    winnerCharacterId,
    loserId,
    loserCharacterId,
  } = prop;

  return prismaClient.match.create({
    data: {
      ladderResetId,
      winnerId,
      winnerCharacterId,
      loserId,
      loserCharacterId,
    },
    select: {
      id: true,
    },
  });
};
