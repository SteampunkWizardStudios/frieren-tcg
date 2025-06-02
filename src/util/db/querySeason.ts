import prismaClient from "@prismaClient";

export type SeasonQuery = Awaited<ReturnType<typeof querySeason>>;

export default async function querySeason(ladderResetId: number) {
  const season = await prismaClient.ladderReset.findUnique({
    select: {
      endDate: true,
    },
    where: {
      id: ladderResetId,
    },
  });

  if (!season) {
    throw new Error(`ladderReset with ID ${ladderResetId} not found.`);
  }

  // A season is the collection of ladderResets with the same end time, but for the code it will be within 10 mins

  if (season.endDate) {
    const upperBound = new Date(season?.endDate);
    upperBound.setMinutes(upperBound.getMinutes() + 10);
    const lowerBound = new Date(season?.endDate);
    lowerBound.setMinutes(lowerBound.getMinutes() - 10);

    return { endDate: { gte: lowerBound, lte: upperBound } };
  } else {
    return { endDate: null };
  }
}
