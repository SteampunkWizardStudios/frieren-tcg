import prismaClient from "./client";

async function main() {
  await prismaClient.$transaction([
    prismaClient.ladder.createMany({
      data: [...["Classic", "Blitz", "Slow"].map((name) => ({ name }))],
    }),
    prismaClient.character.createMany({
      data: [
        ...[
          "Frieren",
          "Laufen",
          "Linie",
          "Sein",
          "Sense",
          "Serie",
          "Stark",
          "Stille",
        ].map((name) => ({ name })),
      ],
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
