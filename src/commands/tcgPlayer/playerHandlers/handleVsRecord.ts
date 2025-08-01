import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getWinrate } from "@src/util/utils";
import { getMatchHistoryAgainstPlayer } from "@src/util/db/getMatchHistory";
import handleVsRecordOverview from "./handleVsRecordOverview";
import querySeason from "@src/util/db/querySeason";

export async function handleVsRecord(interaction: ChatInputCommandInteraction) {
  const player1 = interaction.options.getUser("player") ?? interaction.user;
  const player2 = interaction.options.getUser("opponent");
  const seasonId = interaction.options.getInteger("season") ?? null;
  const seasonQuery = seasonId ? await querySeason(seasonId) : null;

  if (!player2) {
    return handleVsRecordOverview(player1, interaction, seasonQuery);
  }

  const headToHeadMatches = await getMatchHistoryAgainstPlayer(
    player1.id,
    player2.id,
    seasonQuery
  );

  if (headToHeadMatches.length === 0) {
    await interaction.editReply({
      content: `There are no match records between ${player1} and ${player2} for the selected season.`,
    });
    return;
  }

  const mirrorMatches = headToHeadMatches.filter(
    (match) => match.winnerCharacter.name === match.loserCharacter.name
  );
  const player1Wins = headToHeadMatches.filter(
    (match) => match.winner.discordId === player1.id
  ).length;
  const player1Losses = headToHeadMatches.length - player1Wins;
  const overallWinrate = getWinrate(player1Wins, player1Losses);

  const player1MirrorWins = mirrorMatches.filter(
    (match) => match.winner.discordId === player1.id
  ).length;
  const player1MirrorLosses = mirrorMatches.length - player1MirrorWins;
  const mirrorWinrate = getWinrate(player1MirrorWins, player1MirrorLosses);

  const overallRecordSummary = [
    `**Overall Head-to-Head Record:**`,
    `- Total Matches: ${overallWinrate.total}`,
    `- Record: ${player1Wins} wins - ${player1Losses} losses (${overallWinrate.winrate}% win rate)`,
    `**Mirror Matches:**`,
    `- Total Mirror Matches: ${mirrorMatches.length}`,
    `- Record: ${player1MirrorWins} wins - ${player1MirrorLosses} losses (${mirrorWinrate.winrate}% win rate)`,
    `\n`,
  ].join("\n");

  const paginated = formatMatchHistoryPages(
    headToHeadMatches,
    player1,
    `${player1.displayName}'s Head-to-Head vs ${player2.displayName}`,
    { prependDescription: overallRecordSummary }
  );

  await paginated.run(interaction);
}
