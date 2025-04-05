import { EmbedBuilder, User } from "discord.js";
import { PlayerRankedStats } from "./playerStats";

export default function playerStatsEmbed(stats: PlayerRankedStats, user: User) {
  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(`${user.username}'s ranked stats`);

	embed.addFields(
		stats.ladderRanks.map((ladderRank) => ({
			name: ladderRank.ladderReset.ladder.name,
			value: `Rank: ${ladderRank.rankPoints}`,
		}))
	);

  return embed;
}
