import { Prisma } from "@prisma/client";

const matchExt = Prisma.defineExtension({
  query: {
    match: {
      create({ query, args }) {
        validateMatch(args.data);
        return query(args);
      },
      createMany({ query, args }) {
        validateMatch(args.data);
        return query(args);
      },
      createManyAndReturn({ query, args }) {
        validateMatch(args.data);
        return query(args);
      },
    },
  },
});

export default matchExt;

type validateMatchArgs = {
  player1Id?: number;
  player2Id?: number;
  winnerId?: number;
  result?: "PLAYER1_WIN" | "PLAYER2_WIN" | "DRAW";
};

function validateMatch(args: validateMatchArgs | validateMatchArgs[]) {
  if (Array.isArray(args)) {
    return args.forEach(validateMatch);
  }

  const { player1Id, player2Id, winnerId, result } = args;

  if (!player1Id || !player2Id) {
    throw new Error("Player1, Player2 and Winner ids are required");
  }

  if (player1Id === player2Id) {
    throw new Error("Player1 and Player2 must be different");
  }

  if (result === "DRAW") {
    if (winnerId) {
      throw new Error("Draws cannot have a winner");
    }
  } else if (result === "PLAYER1_WIN" || result === "PLAYER2_WIN") {
    if (!winnerId) {
      throw new Error("Non-draws must have a winner");
    }
    // Ensure winner ID matches the result
    if (result === "PLAYER1_WIN" && winnerId !== player1Id) {
      throw new Error("Winner ID must match Player1 for PLAYER1_WIN result");
    }
    if (result === "PLAYER2_WIN" && winnerId !== player2Id) {
      throw new Error("Winner ID must match Player2 for PLAYER2_WIN result");
    }
  }
}
