import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import prismaClient from "./client";
import { CHARACTER_LIST } from "@tcg/characters/characterList";

async function main() {
  await prismaClient.$transaction(async (tx) => {
    await tx.character.createMany({
      data: CHARACTER_LIST.map((character) => character.name).map((name) => ({
        name,
      })),
    });

    const createdLadders = await Promise.all(
      Object.values(GameMode).map((name) =>
        tx.ladder.create({
          data: { name },
        })
      )
    );

    await tx.ladderReset.createMany({
      data: createdLadders.map((ladder) => ({
        ladderId: ladder.id,
        startDate: new Date(),
      })),
    });
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
