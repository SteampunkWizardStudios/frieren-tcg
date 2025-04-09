import { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { characterNameToEmoji } from "@src/tcg/formatting/emojis";
import { EmbedBuilder } from "discord.js";

const rankEmotes: Record<number, String> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function getRankString(rank: number, username: string): string {
  const hasRankEmotes = rank in rankEmotes;
  let rankString = `${hasRankEmotes ? `${rankEmotes[rank]} ` : ""}${rank}. ${username}`;
  if (hasRankEmotes) {
    return "**" + rankString + "**";
  } else {
    return rankString;
  }
}

export default async function leaderboardEmbed(props: {
  usernamePoints: { username: string; points: number }[];
  leaderboard: string;
  isCharacterLeaderboard: boolean;
}): Promise<EmbedBuilder> {
  const { usernamePoints, leaderboard, isCharacterLeaderboard } = props;

  const leaderboardTitle = `${isCharacterLeaderboard ? `${characterNameToEmoji[leaderboard as CharacterName]} ` : ""}${leaderboard} Ranked Global Leaderboard`;
  const userLines = usernamePoints.map((usernamePoint, index) => {
    const { username, points } = usernamePoint;
    const rank = index + 1;
    return `${getRankString(rank, username)}: ${points} pts`;
  });

  return new EmbedBuilder()
    .setColor("Blurple")
    .setTitle(leaderboardTitle)
    .addFields({
      name: "Top 10 Players",
      value: userLines.join("\n"),
    });
}
