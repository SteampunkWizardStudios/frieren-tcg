import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prismaClient from "@prismaClient";
import { LazyPaginatedMessage } from "@sapphire/discord.js-utilities";

const PAGE_SIZE = 12;

export default async function handleMatchHistory(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player") ?? interaction.user;

  const matches = await prismaClient.match.findMany({
    where: {
      OR: [
        {
          winner: {
            discordId: player.id,
          },
        },
        {
          loser: {
            discordId: player.id,
          },
        },
      ],
    },
    include: {
      winnerCharacter: {
        select: {
          name: true,
        },
      },
      loserCharacter: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      finishedAt: "desc",
    },
  });

  if (matches.length === 0) {
    await interaction.editReply({
      content: `${player} has no ranked matches recorded.`,
    });
    return;
  }

  const chunks: (typeof matches)[] = [];
  for (let i = 0; i < matches.length; i += PAGE_SIZE) {
    chunks.push(matches.slice(i, i + PAGE_SIZE));
  }

  const pages = chunks.map((chunk) => {
    const description = chunk
      .map((match) => {
        return `${match}`;
      })
      .join("\n");
    return new EmbedBuilder()
      .setTitle(`${player.username}'s Match History`)
      .setColor("Blurple")
      .setDescription(description);
  });

  const paginated = new LazyPaginatedMessage({ pages });
  await paginated.run(interaction);
}
