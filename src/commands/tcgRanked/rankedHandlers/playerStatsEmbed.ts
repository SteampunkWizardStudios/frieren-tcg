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
      const rank = getRank(ladderRank.rankPoints).rankTitle;
      const capitalizedRank = rank.charAt(0).toUpperCase() + rank.slice(1);

      return {
        name: `${ladderRank.ladderReset.ladder.name}: ${capitalizedRank}`,
        value: `**Points:** ${ladderRank.rankPoints} (#**${relativeRank}**/${totalPlayers})`,
      };
    })
  );

  const characterLines = await Promise.all(
    stats.characterMasteries.map(async (mastery) => {
      const relativeCharacterRank = await getRelativeCharacterRank(
        mastery.masteryPoints,
        mastery.character.id
      );
      const totalCharacterPlayers = await getTotalCharacterPlayers(
        mastery.character.id
      );
      const character = CHARACTER_LIST.find(
        (character) => character.name === mastery.character.name
      );
      const emojiLine = character?.cosmetic.emoji + " " || "";

      return `${emojiLine}**${mastery.character.name}** - ${mastery.masteryPoints} (#**${relativeCharacterRank}**/${totalCharacterPlayers})`;
    })
  );

  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.username}'s ranked stats`)
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
