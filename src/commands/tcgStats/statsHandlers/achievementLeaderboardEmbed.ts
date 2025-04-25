import { EmbedBuilder } from "discord.js";
import { rankEmotes } from "@src/util/formatting/statsEmotes";

export default function achievementLeaderboardEmbed(
  idsToPoints: { id: string; points: number }[],
  page: number,
  pageSize: number
): EmbedBuilder {
  const userLines = idsToPoints.map((idtoPoint, index) => {
    const { id, points } = idtoPoint;
    const rank = index + 1 + (page - 1) * pageSize;
    const maxEmoteRank = Object.keys(rankEmotes).length;
    const rankEmoji = rank <= maxEmoteRank && rankEmotes[rank] ? `${rankEmotes[rank]} ` : "";
    return `${rankEmoji}${rank}. <@${id}>: ${points} achievements`;
  });

  return new EmbedBuilder()
    .setColor("Blurple")
    .setTitle("Achievements Leaderboard")
    .setDescription(userLines.join("\n"));
}