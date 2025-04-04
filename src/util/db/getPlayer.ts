import prismaClient from "../../../prisma/client";

export const getorCreatePlayer = async (
  discordId: string,
): Promise<{ id: number; discordId: string }> => {
  return prismaClient.player.upsert({
    where: {
      discordId: discordId,
    },
    update: {},
    create: {
      discordId: discordId,
    },
  });
};

export const getOrCreatePlayers = async (
  discordIds: string[],
): Promise<{ id: number; discordId: string }[]> => {
  return prismaClient.$transaction(async (_tx) => {
    return Promise.all(
      discordIds.map((discordId) => getorCreatePlayer(discordId)),
    );
  });
};
