import { Prisma } from "@prisma/client";

const masteryExt = Prisma.defineExtension({
  result: {
    characterMastery: {
      totalMatches: {
        compute({ matchesLost, matchesWon, matchesTied }): number {
          return matchesLost + matchesWon + matchesTied;
        },
      },
    },
  },
});

export default masteryExt;
