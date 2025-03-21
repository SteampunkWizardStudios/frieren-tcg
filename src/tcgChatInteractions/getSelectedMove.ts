import {
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
  PrivateThreadChannel,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from "discord.js";
import Character from "../tcg/character";
import Card from "../tcg/card";
import { createCountdownTimestamp } from "../util/utils";

export const getSelectedMove = async (
  player: User,
  playerThread: PrivateThreadChannel,
  character: Character,
  playerPossibleMove: Record<string, Card>,
  turnDurationSeconds: number,
): Promise<Card | null> => {
  if (character.skipTurn) {
    character.skipTurn = false;
    return null;
  }

  const timeLimit = turnDurationSeconds * 1000;
  let isResolved = false;

  // Create the dropdown menu
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`move-select-${player.username}`)
    .setPlaceholder("Select your Move")
    .addOptions(
      Object.entries(playerPossibleMove).map(([index, card]) => ({
        label: `${card.title} +${card.empowerLevel}`,
        value: `${index}`,
        emoji: card.emoji,
      })),
    );

  const dropdown =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const response = await playerThread.send({
    content: `*(Time left: ${createCountdownTimestamp(turnDurationSeconds)})* Select your move:`,
    components: [dropdown],
  });

  const cards: Card[] = Object.values(playerPossibleMove);
  const randomCard: Card = cards[Math.floor(Math.random() * cards.length)];

  return new Promise<Card>((resolve, reject) => {
    const fallbackTimeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn(
          "Fallback timeout triggered in getSelectedMove function - collector failed to end properly.",
        );
        resolve(randomCard);
      }
    }, timeLimit + 5000); // 5 additional seconds for fallback timeout

    try {
      if (response) {
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          time: timeLimit,
        });

        collector.on("collect", async (i: StringSelectMenuInteraction) => {
          try {
            // Verify that the interaction is from the original user
            if (i.user.id !== player.id) {
              await i.reply({
                content: "Invalid user.",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            if (!isResolved) {
              collector.stop("Character selected");
              const selectedCard =
                playerPossibleMove[i.values[0]] ?? randomCard;

              await i.update({
                content: `You selected ${selectedCard.emoji} **${selectedCard.title} +${selectedCard.empowerLevel}**`,
                components: [],
              });

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve(selectedCard);
            }
          } catch (error) {
            console.error(error);
            await i.reply({
              content: "There was an error fetching card.",
              flags: MessageFlags.Ephemeral,
            });
            if (!isResolved) {
              collector.stop("Error occurred");
              isResolved = true;
              clearTimeout(fallbackTimeout);
              reject(error);
            }
          }
        });

        collector.on("end", async (collected) => {
          // When the collector expires, disable the select menu
          if (collected.size === 0) {
            if (!isResolved) {
              await response
                .edit({
                  content: `Timeout! Playing a random card: ${randomCard.emoji} **${randomCard.title} +${randomCard.empowerLevel}**!`,
                  components: [],
                })
                .catch(() => {});

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve(randomCard);
            }
          }
        });
      }
    } catch (error) {
      if (!isResolved) {
        console.error(error);
        isResolved = true;
        clearTimeout(fallbackTimeout);
        reject(error);
      }
    }
  });
};
