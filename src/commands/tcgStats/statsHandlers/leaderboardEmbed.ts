import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { characterNameToEmoji } from "@tcg/formatting/emojis";
import { ColorResolvable, EmbedBuilder } from "discord.js";
import { rankEmotes } from "@src/util/formatting/statsEmotes";
import { getWinrate } from "@src/util/utils";

function getRankString(rank: number, id: string): string {
  const hasRankEmotes = rank in rankEmotes;
  const rankString = `${hasRankEmotes ? `${rankEmotes[rank]} ` : ""}${rank}. <@${id}>`;
  if (hasRankEmotes) {
    return "**" + rankString + "**";
  } else {
    return rankString;
  }
}

export default function leaderboardEmbed(props: {
  idsToPoints: { id: string; points: number; wins?: number; losses?: number }[];
  leaderboard: string;
  isCharacterLeaderboard: boolean;
  page?: number;
  pageSize?: number;
  color?: ColorResolvable;
}): EmbedBuilder {
  const {
    idsToPoints,
    leaderboard,
    isCharacterLeaderboard,
    page = 1,
    pageSize = 12,
    color = "Blurple",
  } = props;

  // when isCharacterLeaderboard is true, leaderboard is a character name, otherwise it's the name of a ladder (classic, blitz, etc.)
  const charEmoji = isCharacterLeaderboard
    ? characterNameToEmoji[leaderboard as CharacterName] + " "
    : "";
  const leaderboardTitle = `${charEmoji}${leaderboard} Ranked Global Leaderboard`;

  const userLines = idsToPoints.map((idtoPoint, index) => {
    const { id, points, wins, losses } = idtoPoint;
    const winRate = wins && losses ? getWinrate(wins, losses).winrate : null;
    const wrLine = winRate ? ` (${winRate}% WR)` : "";
    const rank = index + 1 + (page - 1) * pageSize;
    return `${getRankString(rank, id)}: ${points} pts${wrLine}`;
  });

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(leaderboardTitle)
    .addFields({
      name: "Top Players",
      value: userLines.join("\n"),
    });
}
