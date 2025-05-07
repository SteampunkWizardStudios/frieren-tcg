import {
  ActionRowBuilder,
  ComponentType,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ThreadChannel,
  User,
} from "discord.js";
import Character from "@tcg/character";
import Card from "@tcg/card";
import { createCountdownTimestamp } from "@src/util/utils";

// handle card selection and play the card
// returns the card played
export const playSelectedMove = async (
  player: User,
  playerThread: ThreadChannel<false>,
  character: Character,
  playerPossibleMove: Record<string, Card>,
  turnDurationSeconds: number
): Promise<Card | null> => {
  if (character.skipTurn) {
    character.skipTurn = false;
  }

  const timeLimit = turnDurationSeconds * 1000;
  let isResolved = false;

  // Create the dropdown menu
  const moveSelectId = `move-select-${player.username}-${Date.now()}`;
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(moveSelectId)
    .setPlaceholder("Select your Move")
    .addOptions(
      Object.entries(playerPossibleMove).map(([index, card]) => ({
        label: `${card.getTitle()}`,
        value: `${index}`,
        emoji: card.emoji,
      }))
    );

  const dropdown =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  const response = await playerThread.send({
    content: `*(Time left: ${createCountdownTimestamp(turnDurationSeconds)})* Select your move:`,
    components: [dropdown],
  });

  const cards: Card[] = Object.values(playerPossibleMove);
  const randomCard: Card =
    cards[Math.floor(Math.random() * (cards.length - 1))]; // -1 so Forfeit is always avoided

  return new Promise<Card>((resolve, reject) => {
    const fallbackTimeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn(
          "Fallback timeout triggered in getSelectedMove function - collector failed to end properly."
        );
        resolve(randomCard);
      }
    }, timeLimit + 5000); // 5 additional seconds for fallback timeout

    try {
      if (response) {
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          filter: (i) => i.customId === moveSelectId,
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
              if (!i.replied && !i.deferred) {
                await i.deferUpdate();
              }
              collector.stop("Character selected");

              const selectedCardIndex = parseInt(i.values[0]);
              const selectedCard =
                playerPossibleMove[i.values[0]] ?? randomCard;
              if (selectedCardIndex < 6) {
                character.playCard(selectedCardIndex);
              }

              await i.editReply({
                content: `You selected ${selectedCard.emoji} **${selectedCard.getTitle()}**`,
                components: [],
              });

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve(selectedCard);
            }
          } catch (error) {
            console.error(error);

            // reply only if hasn't been acknowledged
            if (!i.replied && !i.deferred) {
              await i.reply({
                content: "There was an error fetching card.",
                flags: MessageFlags.Ephemeral,
              });
            } else {
              await i.editReply({
                content: "There was an error fetching card.",
              });
            }

            if (!isResolved) {
              collector.stop("Error occurred");
              isResolved = true;
              clearTimeout(fallbackTimeout);
              reject(error);
            }
          }
        });

        collector.on("end", async (collected) => {
          try {
            // When the collector expires, disable the select menu
            if (collected.size === 0) {
              if (!isResolved) {
                await response
                  .edit({
                    content: `Timeout! Playing a random card: ${randomCard.emoji} **${randomCard.getTitle()}**!`,
                    components: [],
                  })
                  .catch(() => {});

                isResolved = true;
                clearTimeout(fallbackTimeout);
                resolve(randomCard);
              }
            }
          } catch (error) {
            console.error("Error in collector end event:", error);
            if (!isResolved) {
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
