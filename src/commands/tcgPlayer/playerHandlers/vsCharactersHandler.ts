import { ChatInputCommandInteraction } from "discord.js";
import { formatMatchHistoryPages } from "./formatMatchHistoryPages";
import { getWinrate } from "@src/util/utils";
import { getMatchHistoryAgainstCharacter } from "@src/util/db/getMatchHistory";
<<<<<<< HEAD:src/commands/tcgPlayer/playerHandlers/vsCharactersHandler.ts
=======
import handleVsCharacterRecordOverview from "./handleVsCharacterOverview";
import querySeason from "@src/util/db/querySeason";
import { charWithEmoji } from "@tcg/formatting/emojis";
>>>>>>> a940d0a62aaf6eba231712e02dcd5ca8c686ba4a:src/commands/tcgPlayer/playerHandlers/vsCharacterHandler.ts
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export async function handleVsCharacter(
  interaction: ChatInputCommandInteraction
) {
<<<<<<< HEAD:src/commands/tcgPlayer/playerHandlers/vsCharactersHandler.ts
  const playerId = interaction.options.getUser("player") ?? interaction.user;
  const playerCharacter: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;
  const oppCharacter: CharacterName =
    (interaction.options.getString("character") as CharacterName) ??
    CharacterName.Frieren;
=======
  const player = interaction.options.getUser("player") ?? interaction.user;
  const playerCharacter = interaction.options.getString("player-character");
  const oppCharacter = interaction.options.getString("opponent-character");
  const seasonId = interaction.options.getInteger("season");
  const seasonQuery = seasonId ? await querySeason(seasonId) : null;

  if (!oppCharacter) {
    return handleVsCharacterRecordOverview(
      player,
      playerCharacter,
      interaction,
      seasonQuery
    );
  }

>>>>>>> a940d0a62aaf6eba231712e02dcd5ca8c686ba4a:src/commands/tcgPlayer/playerHandlers/vsCharacterHandler.ts
  const vsCharacterMatches = await getMatchHistoryAgainstCharacter(
    player.id,
    playerCharacter,
<<<<<<< HEAD:src/commands/tcgPlayer/playerHandlers/vsCharactersHandler.ts
    oppCharacter);
    
  if (vsCharacterMatches.length === 0) {
    await interaction.editReply({
      content: `There are no records of ${playerId} against ${oppCharacter} in the current ladder.`,
=======
    oppCharacter,
    seasonQuery
  );

  if (vsCharacterMatches.length === 0) {
    await interaction.editReply({
      content: `There are no records of this matchup in the selected ladder.`,
>>>>>>> a940d0a62aaf6eba231712e02dcd5ca8c686ba4a:src/commands/tcgPlayer/playerHandlers/vsCharacterHandler.ts
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
