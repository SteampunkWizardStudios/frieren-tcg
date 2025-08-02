import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getMatchHistory } from "@src/util/db/getMatchHistory";
import querySeason from "@src/util/db/querySeason";

export default async function handleMatchHistory(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player") ?? interaction.user;
  const page = interaction.options.getInteger("page") ?? 1;

  const seasonId = interaction.options.getInteger("season");
  const seasonQuery = seasonId ? await querySeason(seasonId) : null;

  const matches = await getMatchHistory(player.id, seasonQuery);

  if (matches.length === 0) {
    await interaction.editReply({
      content: `${player} has no ranked matches recorded for the selected season.`,
    });
    return;
  }

  const paginated = formatMatchHistoryPages(
    matches,
    player,
    `${player.displayName}'s Match History`,
    { startingPage: page }
  );

  await paginated.run(interaction);
}
