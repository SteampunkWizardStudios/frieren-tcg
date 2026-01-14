import prismaClient from "../../../prisma/client";

type CreateMatchProps = {
  ladderResetId: number;
  winnerId: number;
  winnerCharacterId: number;
  loserId: number;
  loserCharacterId: number;
  threadId: string;
  ranked: boolean;
  bannedCharacterIds?: number[];
};

export const createMatch = async ({
  ladderResetId,
  winnerId,
  winnerCharacterId,
  loserId,
  loserCharacterId,
  threadId,
  ranked,
  bannedCharacterIds,
}: CreateMatchProps): Promise<{ id: number }> => {
  const uniqueBannedIds = Array.from(new Set(bannedCharacterIds ?? []));

  return prismaClient.$transaction(async (tx) => {
    const match = await tx.match.create({
      data: {
        ladderResetId,
        winnerId,
        winnerCharacterId,
        loserId,
        loserCharacterId,
        threadId,
        ranked,
      },
      select: {
        id: true,
      },
    });

    if (uniqueBannedIds.length > 0) {
      await tx.characterBan.createMany({
        data: uniqueBannedIds.map((characterId) => ({
          matchId: match.id,
          characterId,
        })),
        skipDuplicates: true,
      });
    }

    return match;
  });
};
