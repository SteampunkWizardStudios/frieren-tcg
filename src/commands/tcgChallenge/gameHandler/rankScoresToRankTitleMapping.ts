import { RANK_SCORE_TO_RANK_MAPPING } from "@src/constants";
import type { Collection, GuildMember, Role } from "discord.js";

export type Rank = {
  rankLevel: number;
  rankTitle: string;
  rankRoleId: string;
};

export const getRank = (score: number): Rank => {
  if (score >= 500) {
    return RANK_SCORE_TO_RANK_MAPPING[500];
  } else if (score <= 0) {
    return RANK_SCORE_TO_RANK_MAPPING[0];
  } else {
    const flooredScore = Math.floor(score / 100) * 100;
    if (flooredScore in RANK_SCORE_TO_RANK_MAPPING) {
      return RANK_SCORE_TO_RANK_MAPPING[flooredScore];
    } else {
      throw new Error(
        `Invalid score ${score} with floored score ${flooredScore}`
      );
    }
  }
};

export async function getNewRolesForRank(
  member: GuildMember,
  rank: Rank
): Promise<Collection<string, Role>> {
  const currentRoles = member.roles.cache;

  const allRankRoleIds = Object.values(RANK_SCORE_TO_RANK_MAPPING).map(
    (rankMapping) => rankMapping.rankRoleId
  );

  const rankRoleIdSet = new Set(allRankRoleIds);
  const rolesWithoutOldRanks = currentRoles.filter(
    (role) => !rankRoleIdSet.has(role.id)
  );

  const newRankRole = member.guild.roles.cache.get(rank.rankRoleId);

  if (!newRankRole) {
    console.error(
      `Rank role with ID ${rank.rankRoleId} not found in guild cache.`
    );
    return rolesWithoutOldRanks;
  }

  const finalRoles = rolesWithoutOldRanks.set(newRankRole.id, newRankRole);

  return finalRoles;
}
