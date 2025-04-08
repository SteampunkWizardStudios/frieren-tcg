import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import { getOrCreateCharacters } from "@src/util/db/getCharacter";

export async function getTop5PlayersInGamemode(gamemode: GameMode) {
  const ladder = await prismaClient.ladder.findUnique({
    where: { name: gamemode },
    include: {
      resets: {
        orderBy: { startDate: "desc" },
        take: 1,
      },
    },
  });

  if (!ladder || ladder.resets.length === 0) {
    throw new Error(`No ladder or resets found for gamemode: ${gamemode}`);
  }

  const latestResetId = ladder.resets[0].id;

  const top5 = await prismaClient.ladderRank.findMany({
    where: { ladderResetId: latestResetId },
    orderBy: { rankPoints: "desc" },
    take: 5,
    include: {
      player: true,
    },
  });

  return top5;
}

export async function getTop5PlayersPerCharacter(gamemode: GameMode) {
  const ladder = await prismaClient.ladder.findUnique({
    where: { name: gamemode },
    include: {
      resets: {
        orderBy: { startDate: "desc" },
        take: 1,
      },
    },
  });

  if (!ladder || ladder.resets.length === 0) {
    throw new Error(`No ladder or resets found for gamemode: ${gamemode}`);
  }

  const latestResetId = ladder.resets[0].id;

  const characters = CHARACTER_LIST;

  const result: Record<string, PlayerStats[]> = {};

  for (const character of characters) {
    const [characterDbObject] = await getOrCreateCharacters([character.name]);
    if (!characterDbObject) {
      console.log(`Character ${character.name} not found in database`);
      continue;
    }

    const matches = await prismaClient.match.findMany({
      where: {
        ladderResetId: latestResetId,
        OR: [
          { winnerCharacterId: characterDbObject.id },
          { loserCharacterId: characterDbObject.id },
        ],
      },
      select: {
        winnerId: true,
        loserId: true,
      },
    });

    // Extract unique player IDs
    const playerIds = Array.from(
      new Set(matches.flatMap((m) => [m.winnerId, m.loserId]))
    );

    if (playerIds.length === 0) {
      continue;
    }

    const topPlayers = await prismaClient.ladderRank.findMany({
      where: {
        ladderResetId: latestResetId,
        playerId: { in: playerIds },
      },
      include: {
        player: true,
      },
      orderBy: {
        rankPoints: "desc",
      },
      take: 5,
    });

    result[character.name] = topPlayers.map((rank) => ({
      playerId: rank.playerId,
      discordId: rank.player.discordId,
      rankPoints: rank.rankPoints,
    }));
  }

  return result;
}

interface PlayerStats {
  playerId: number;
  discordId: string;
  rankPoints: number;
}
