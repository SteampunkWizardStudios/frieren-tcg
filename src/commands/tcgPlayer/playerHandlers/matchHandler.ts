import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prismaClient from "@prismaClient";
import {
  LazyPaginatedMessage,
  PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";

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
      winner: {
        select: {
          discordId: true,
        },
      },
      loser: {
        select: {
          discordId: true,
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

  const pages = chunks.map((chunk, pageIndex) => {
	const description = chunk
	  .map((match, matchIndex) => {
		const globalIndex = pageIndex * PAGE_SIZE + matchIndex;
		const matchNumber = matches.length - globalIndex;
		const { winnerId, winnerCharacter, loserCharacter, finishedAt, winner, loser } = match;
		const won = winnerId.toString() === player.id;
		const result = won ? "Won" : "Lost";
		const character = won ? winnerCharacter.name : loserCharacter.name;
		const opponent = `<@${won ? loser.discordId : winner.discordId}>`;
		const opponentCharacter = won ? loserCharacter.name : winnerCharacter.name;
		const timestamp = `<t:${Math.floor(new Date(finishedAt).getTime() / 1000)}:R>`;
  
		return `${matchNumber}. ${result} with ${character} against ${opponent} as ${opponentCharacter} ${timestamp}`;
	  })
	  .join("\n");
  
	const embed = new EmbedBuilder()
	  .setTitle(`${player.username}'s Match History`)
	  .setColor("Blurple")
	  .setDescription(description);
  
	const page: PaginatedMessageMessageOptionsUnion = {
	  embeds: [embed],
	};
  
	return page;
  });

  const paginated = new LazyPaginatedMessage({ pages });
  await paginated.run(interaction);
}
