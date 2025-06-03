import { AutocompleteInteraction, SlashCommandIntegerOption } from "discord.js";
import prismaClient from "@prismaClient";
import { GameMode } from "@src/commands/tcgChallenge/gameHandler/gameSettings";

export default async function seasonAutocomplete(
  interaction: AutocompleteInteraction
) {
  const data = await prismaClient.ladderReset.findMany({
    where: {
      ladder: {
        name: GameMode.CLASSIC,
      },
    },
  });

  const focusedValue = interaction.options.getFocused();

  const options = data.map((season) => {
    const date = new Date(season.startDate);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return {
      name: `${month} ${year} Season - ID: ${season.id}`,
      value: season.id,
    };
  });

  const filtered = options
    .filter((options) => {
      return options.name.toLowerCase().includes(focusedValue.toLowerCase());
    })
    .slice(0, 25);

  await interaction.respond(filtered);
}

export const seasonOption = new SlashCommandIntegerOption()
  .setName("season")
  .setDescription(
    "The season to get stats for, defaults to the current season."
  )
  .setAutocomplete(true);
