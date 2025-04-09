import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import prismaClient from "../../../prisma/client";

export const getLatestLadderReset = async (props: {
  gamemode: GameMode;
}): Promise<{ id: number } | null> => {
  const currLadder = await prismaClient.ladder.findFirst({
    where: {
      name: props.gamemode,
    },
  });

  if (currLadder) {
    return await prismaClient.ladderReset.findFirst({
      where: {
        ladderId: currLadder.id,
        endDate: null,
      },
      select: {
        id: true,
      },
    });
  } else {
    return null;
  }
};
