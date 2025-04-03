import { Prisma } from '@prisma/client';

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
            }
        }
    }
});

export default matchExt;

type validateMatchArgs = {
	player1Id?: number;
	player2Id?: number;
	winnerId?: number;
}

function validateMatch(args: validateMatchArgs | validateMatchArgs[]) {
	if (Array.isArray(args)) {
		return args.forEach(validateMatch);
	}

	const { player1Id, player2Id, winnerId } = args;

    if (!player1Id || !player2Id || !winnerId) {
        throw new Error("Player1, Player2 and Winner ids are required");
    }

    if (player1Id === player2Id) {
        throw new Error("Player1 and Player2 must be different");
    }
	
    if (winnerId !== player1Id && winnerId !== player2Id) {
        throw new Error("Winner must be one of the players");
    }
}