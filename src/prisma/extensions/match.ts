import { Prisma } from '@prisma/client';

const matchExt = Prisma.defineExtension({
    query: {
        match: {
            create({ query, args }) {
                const { player1, player2, winner } = args.data;
                if (player1 === player2) {
                    throw new Error("Player1 and Player2 must be different");
                }
                if (winner !== player1 && winner !== player2) {
                    throw new Error("Winner must be one of the players");
                }
                return query(args);
            }
        }
    }
});

export default matchExt;