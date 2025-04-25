import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ComponentType,
  ButtonStyle,
} from "discord.js";
import prismaClient from "@prismaClient";
import {
  LazyPaginatedMessage,
  type PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import achievementLeaderboardEmbed from "./achievementLeaderboardEmbed";

const PAGE_SIZE = 10;

export default async function handleAchievementLeaderboard(
  interaction: ChatInputCommandInteraction
) {
  const data = await prismaClient.player.findMany({
    select: {
      discordId: true,
      _count: {
        select: {
          achievements: true,
        },
      },
    },
    orderBy: {
      achievements: {
        _count: "desc",
      },
    },
  });

  const idsToPoints = data.map((player) => ({
    id: player.discordId,
    points: player._count.achievements,
  }));

  const totalPages = Math.ceil(idsToPoints.length / PAGE_SIZE);

  const pages = Array.from({ length: totalPages }, (_, i) => async () => {
    const pageData = idsToPoints.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    const embed = achievementLeaderboardEmbed(pageData, i + 1, PAGE_SIZE);

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  if (pages.length === 0) {
    const leaderboardTitle = "Achievements Leaderboard";
    const noPlayersFoundEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle(leaderboardTitle)
      .setDescription(
        "No players found in this leaderboard. Maybe you could be the first one?"
      );

    await interaction.editReply({
      embeds: [noPlayersFoundEmbed],
    });
    return;
  }

  const paginated = new LazyPaginatedMessage({ pages });
  paginated.actions.forEach((action) => {
    if (action.type === ComponentType.Button) {
      action.style = ButtonStyle.Secondary;
    }
  });
  await paginated.run(interaction);
}
