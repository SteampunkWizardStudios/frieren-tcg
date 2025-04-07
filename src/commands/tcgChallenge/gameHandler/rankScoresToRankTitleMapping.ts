export type Rank = {
  rankLevel: number;
  rankTitle: string;
};

const rankScoresToRankTitleMapping: Record<number, Rank> = {
  0: {
    rankLevel: 0,
    rankTitle: "Apprentice Battle Mage",
  },
  100: {
    rankLevel: 1,
    rankTitle: "5th-class Battle Mage",
  },
  200: {
    rankLevel: 2,
    rankTitle: "4th-class Battle Mage",
  },
  300: {
    rankLevel: 3,
    rankTitle: "3rd-class Battle Mage",
  },
  400: {
    rankLevel: 4,
    rankTitle: "2nd-class Battle Mage",
  },
  500: {
    rankLevel: 5,
    rankTitle: "1st-class Battle Mage",
  },
};

export const getRank = (score: number): Rank => {
  if (score >= 500) {
    return rankScoresToRankTitleMapping[500];
  } else if (score <= 0) {
    return rankScoresToRankTitleMapping[0];
  } else {
    const flooredScore = Math.floor(score / 100) * 100;
    if (flooredScore in rankScoresToRankTitleMapping) {
      return rankScoresToRankTitleMapping[flooredScore];
    } else {
      throw new Error(
        `Invalid score ${score} with floored score ${flooredScore}`
      );
    }
  }
};
