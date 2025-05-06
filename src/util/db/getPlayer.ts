import prismaClient from "../../../prisma/client";

export const getOrCreatePlayers = async (
  discordIds: string[]
): Promise<{ id: number; discordId: string }[]> => {
  return prismaClient.$transaction(async (tx) => {
    return await Promise.all(
      discordIds.map((discordId) => {
        return tx.player.upsert({
          where: {
            discordId: discordId,
          },
          update: {},
          create: {
            discordId: discordId,
          },
        });
      })
    );
  });
};

export async function getPlayer(discordId: string) {
  return prismaClient.player.upsert({
    where: {
      discordId: discordId,
    },
    update: {},
    create: {
      discordId: discordId,
    },
  });
}
