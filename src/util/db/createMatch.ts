import prismaClient from "../../../prisma/client";

export const createMatch = async (prop: {
  ladderResetId: number;
  winnerId: number;
  winnerCharacterId: number;
  loserId: number;
  loserCharacterId: number;
  threadId: string;
}): Promise<{ id: number }> => {
  const {
    ladderResetId,
    winnerId,
    winnerCharacterId,
    loserId,
    loserCharacterId,
    threadId,
  } = prop;

  return prismaClient.match.create({
    data: {
      ladderResetId,
      winnerId,
      winnerCharacterId,
      loserId,
      loserCharacterId,
      threadId,
    },
    select: {
      id: true,
    },
  });
};
