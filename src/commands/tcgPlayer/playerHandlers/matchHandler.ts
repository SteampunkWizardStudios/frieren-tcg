import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getMatchHistory } from "@src/util/db/getMatchHistory";

export default async function handleMatchHistory(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player") ?? interaction.user;

  const matches = await getMatchHistory(player.id);

  if (matches.length === 0) {
    await interaction.editReply({
      content: `${player} has no ranked matches recorded in the current ladder.`,
    });
    return;
  }

  const paginated = formatMatchHistoryPages(
    matches,
    player,
    `${player.displayName}'s Match History`
  );

  await paginated.run(interaction);
}
