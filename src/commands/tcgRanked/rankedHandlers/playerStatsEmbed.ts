import { EmbedBuilder, User } from "discord.js";
import { PlayerRankedStats } from "./playerStats";
import {
  getRelativeRank,
  getRelativeCharacterRank,
  getTotalPlayers,
  getTotalCharacterPlayers,
} from "./getRelativeRank";
import { getRank } from "@src/commands/tcgChallenge/gameHandler/rankScoresToRankTitleMapping";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import { capitalizeFirstLetter } from "@src/util/utils";

export default async function playerStatsEmbed(
  stats: PlayerRankedStats,
  user: User
) {
  const ladderRankFields = await Promise.all(
    stats.ladderRanks.map(async (ladderRank) => {
      const relativeRank = await getRelativeRank(
        ladderRank.ladderReset.id,
        ladderRank.rankPoints
      );
      const totalPlayers = await getTotalPlayers(ladderRank.ladderReset.id);

      const ladderName = ladderRank.ladderReset.ladder.name;
      const capitalizedLadderName = capitalizeFirstLetter(ladderName);
      const rankName = getRank(ladderRank.rankPoints).rankTitle;

      return {
        name: `${capitalizedLadderName}: ${rankName}`,
        value: `**Points:** ${ladderRank.rankPoints} (#**${relativeRank}**/${totalPlayers})`,
      };
    })
  );

  const characterLines = await Promise.all(
    stats.characterMasteries.map(async (mastery) => {
      const [relativeCharacterRank, totalCharacterPlayers] = await Promise.all([
        getRelativeCharacterRank(mastery.masteryPoints, mastery.character.id),
        getTotalCharacterPlayers(mastery.character.id),
      ]);

      const character = CHARACTER_LIST.find(
        (character) => character.name === mastery.character.name
      );
      const emojiLine = character?.cosmetic.emoji + " " || "";

      return (
        `${emojiLine}**${mastery.character.name}** - ${mastery.masteryPoints} (#**${relativeCharacterRank}**/${totalCharacterPlayers})` +
        `\n${winRateLine(mastery.wins, mastery.losses)}\n`
      );
    })
  );

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.displayName}'s ranked stats`)
    .addFields({
      name: "Ladder Ranks:",
      value: ladderRankFields
        .map((field) => `${field.name}\n${field.value}`)
        .join("\n\n"),
    })
    .addFields({
      name: "Character Masteries:",
      value: characterLines.join("\n"),
    });

  return embed;
}

function winRateLine(wins: number, losses: number) {
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? wins / totalGames : 0;
  return `${wins} Wins, ${losses} Losses, Winrate: ${(winRate * 100).toFixed(2)}%`;
}
