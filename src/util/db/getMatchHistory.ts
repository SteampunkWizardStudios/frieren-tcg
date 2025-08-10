import prismaClient from "@prismaClient";
import { SeasonQuery } from "./querySeason";

export async function getMatchHistory(
  playerId: string,
  seasonQuery: SeasonQuery | null
) {
  const matches = await prismaClient.match.findMany({
    where: {
      ladderReset: seasonQuery ?? { endDate: null },
      OR: [
        {
          winner: {
            discordId: playerId,
          },
        },
        {
          loser: {
            discordId: playerId,
          },
        },
      ],
    },
    include: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
      winner: {
        select: {
          discordId: true,
        },
      },
      loser: {
        select: {
          discordId: true,
        },
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  return matches;
}

export async function getMatchHistoryAgainstPlayer(
  player1: string,
  player2: string,
  seasonQuery: SeasonQuery | null
) {
  const headToHeadMatches = await prismaClient.match.findMany({
    where: {
      ladderReset: seasonQuery ?? { endDate: null },
      OR: [
        {
          winner: {
            discordId: player1,
          },
          loser: {
            discordId: player2,
          },
        },
        {
          winner: {
            discordId: player2,
          },
          loser: {
            discordId: player1,
          },
        },
      ],
    },
    include: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
      winner: {
        select: {
          discordId: true,
        },
      },
      loser: {
        select: {
          discordId: true,
        },
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  return headToHeadMatches;
}

export async function getMatchHistoryAgainstCharacter(
  playerId: string,
  playerCharacter: string,
  oppCharacter: string
) {
  const matches = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
      OR: [
        {
          winner: {
            discordId: playerId,
          },
        },
        {
          loser: {
            discordId: oppCharacter,
          },
        },
      ],
    },
    include: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
      winner: {
        select: {
          discordId: true,
        },
      },
      loser: {
        select: {
          discordId: true,
        },
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  return matches;
}
