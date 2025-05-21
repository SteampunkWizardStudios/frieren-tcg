import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import prismaClient from "./client";
import { CHARACTER_LIST } from "@tcg/characters/characterList";

async function main() {
  await prismaClient.$transaction(async (tx) => {
    // Upsert characters
    await Promise.all(
      CHARACTER_LIST.map((character) =>
        tx.character.upsert({
          where: { name: character.name },
          update: {},
          create: { name: character.name },
        })
      )
    );

    // Upsert ladders
    const createdLadders = await Promise.all(
      Object.values(GameMode).map((name) =>
        tx.ladder.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    // upsert ladder resets
    await Promise.all(
      createdLadders.map((ladder) =>
        tx.ladderReset.upsert({
          where: { id: ladder.id },
          update: {},
          create: {
            ladderId: ladder.id,
            startDate: new Date(),
          },
        })
      )
    );
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
