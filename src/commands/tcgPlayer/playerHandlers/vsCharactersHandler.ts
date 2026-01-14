import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getWinrate } from "@src/util/utils";
import { getMatchHistoryAgainstCharacter } from "@src/util/db/getMatchHistory";
import { charWithEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export async function handleVsCharacter(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player") ?? interaction.user;
  const playerCharacter: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;
  const oppCharacter: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;
  const vsCharacterMatches = await getMatchHistoryAgainstCharacter(
    player.id,
    playerCharacter,
    oppCharacter
  );

  if (vsCharacterMatches.length === 0) {
    await interaction.editReply({
      content: `There are no records of ${player.id} against ${oppCharacter} in the current ladder.`,
    });
    return;
  }

  const mirrorMatches = vsCharacterMatches.filter(
    (match) => match.winnerCharacter.name === match.loserCharacter.name
  );
  const playerWins = vsCharacterMatches.filter(
    (match) => match.winner.discordId === player.id
  ).length;
  const playerLosses = vsCharacterMatches.length - playerWins;
  const overallWinrate = getWinrate(playerWins, playerLosses);

  const playerMirrorWins = mirrorMatches.filter(
    (match) => match.winner.discordId === player.id
  ).length;
  const playerMirrorLosses = mirrorMatches.length - playerMirrorWins;
  const mirrorWinrate = getWinrate(playerMirrorWins, playerMirrorLosses);

  const overallRecordSummary = [
    `**Overall Record vs Character:**`,
    `- Total Matches: ${overallWinrate.total}`,
    `- Record: ${playerWins} wins - ${playerLosses} losses (${overallWinrate.winrate}% win rate)`,
    `**Mirror Matches:**`,
    `- Total Mirror Matches: ${mirrorMatches.length}`,
    `- Record: ${playerMirrorWins} wins - ${playerMirrorLosses} losses (${mirrorWinrate.winrate}% win rate)`,
    `\n`,
  ].join("\n");

  // Import charWithEmoji and CharacterName at the top if not already imported
  // import { charWithEmoji, CharacterName } from "@src/util/characterUtils";

  const title = !playerCharacter
    ? `${player.displayName}'s Record Against ${charWithEmoji(oppCharacter as CharacterName)}`
    : `${player.displayName}'s Record Against ${charWithEmoji(oppCharacter as CharacterName)} with ${charWithEmoji(playerCharacter as CharacterName)}`;

  const paginated = formatMatchHistoryPages(vsCharacterMatches, player, title, {
    prependDescription: overallRecordSummary,
  });

  await paginated.run(interaction);
}
