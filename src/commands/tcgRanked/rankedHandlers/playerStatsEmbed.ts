import { EmbedBuilder, User } from "discord.js";
import { PlayerRankedStats } from "./playerStats";

export default function playerStatsEmbed(stats: PlayerRankedStats, user: User) {
  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.username}'s ranked stats`)
	.setDescription("Characters:\n" + stats.characterMasteries.map((mastery) => `${mastery.character.name} - ${mastery.masteryPoints} (#1/100)`).join("\n") || "No character masteries found")
    .addFields(
      stats.ladderRanks.map((ladderRank) => ({
        name: `${ladderRank.ladderReset.ladder.name}: x-Class-Mage`,
        value: `Points: ${ladderRank.rankPoints} (#1/100)`,
      }))
    );

  return embed;
}
