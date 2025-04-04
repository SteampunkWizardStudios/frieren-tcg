import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";
import prismaClient from "./client";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";

async function main() {
  await prismaClient.$transaction([
    prismaClient.ladder.createMany({
      data: Object.values(GameMode).map((name) => ({ name })),
    }),
    prismaClient.character.createMany({
      data: CHARACTER_LIST.map((character) => character.name).map((name) => ({
        name,
      })),
    }),
  ]);
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
