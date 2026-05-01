import { AutocompleteInteraction } from "discord.js";
import prismaClient from "@prismaClient";

export default async function handleAchievementAutocomplete(
  interaction: AutocompleteInteraction
) {
  const focused = interaction.options.getFocused(true);

  if (!(focused.name === "achievement")) {
    return await interaction.respond([]);
  }

  const search = focused.value;

  const achievements = await prismaClient.achievement.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      id: "desc",
    },
    take: 25,
  });

  const choices = achievements.reverse().map((achievement) => ({
    name: achievement.name,
    value: achievement.id.toString(),
  }));

  return await interaction.respond(choices);
}
