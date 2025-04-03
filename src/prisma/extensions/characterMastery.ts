import { Prisma } from "@prisma/client";

// prisma computed value, cannot be selected for but is returned in the result
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
