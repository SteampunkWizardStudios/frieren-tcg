import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ComponentType,
  ButtonStyle,
} from "discord.js";
import prismaClient from "@prismaClient";
import {
  LazyPaginatedMessage,
  PaginatedMessageMessageOptionsUnion,
} from "@sapphire/discord.js-utilities";
import { charWithEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { buildThreadLink } from "@src/util/formatting/links";

const PAGE_SIZE = 10;

export default async function handleMatchHistory(
  interaction: ChatInputCommandInteraction
) {
  const player = interaction.options.getUser("player") ?? interaction.user;

  const matches = await prismaClient.match.findMany({
    where: {
      ladderReset: {
        endDate: null,
      },
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
        const matchNumber =
          matches.length - (pageIndex * PAGE_SIZE + matchIndex);
        const { winnerCharacter, loserCharacter, finishedAt, winner, loser } =
          match;
        const won = winner.discordId === player.id;
        const result = won ? "🏆 **Won**" : "💥 **Lost**";
        const character = charWithEmoji(
          (won ? winnerCharacter.name : loserCharacter.name) as CharacterName
        );
        const opponent = `<@${won ? loser.discordId : winner.discordId}>`;
        const opponentCharacter = charWithEmoji(
          (won ? loserCharacter.name : winnerCharacter.name) as CharacterName
        );
        const timestamp = `<t:${Math.floor(new Date(finishedAt).getTime() / 1000)}:R>`;
        const resultText = match.threadId
          ? `[${result}](${buildThreadLink(match.threadId)})`
          : `${result}`;

        return `${matchNumber}\\. ${resultText} with ${character}  ${timestamp}\n against ${opponent} as ${opponentCharacter}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle(`${player.displayName}'s Match History`)
      .setColor("Blurple")
      .setDescription(description);

    const page: PaginatedMessageMessageOptionsUnion = {
      embeds: [embed],
    };

    return page;
  });

  const paginated = new LazyPaginatedMessage({ pages });
  paginated.actions.forEach((action) => {
    if (action.type === ComponentType.Button) {
      action.style = ButtonStyle.Secondary;
    }
  });
  await paginated.run(interaction);
}
