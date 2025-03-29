import {
  ComponentType,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuInteraction,
  ThreadChannel,
  User,
} from "discord.js";
import { createCharacterDropdown } from "../util/createCharacterDropdown";
import { createCharacterList } from "../tcg/characters/characterList";
import { CharacterData } from "../tcg/characters/characterData/characterData";

export const getPlayerCharacter = async (
  player: User,
  playerThread: ThreadChannel<false>,
): Promise<CharacterData | null> => {
  const timeLimitSeconds = 60;
  const timeLimit = timeLimitSeconds * 1000;
  let isResolved = false;

  const characterSelectId = `character-select-${player.id}-${Date.now()}`;
  const characterDropdown = await createCharacterDropdown(
    player,
    characterSelectId,
    timeLimitSeconds,
  );

  const response = await playerThread.send({
    embeds: [characterDropdown.embed],
    components: [characterDropdown.dropdown],
  });

  return new Promise<CharacterData | null>((resolve, reject) => {
    const fallbackTimeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn(
          "Fallback timeout triggered in getPlayerCharacter function - collector failed to end properly.",
        );
        resolve(null);
      }
    }, timeLimit + 5000); // 5 additional seconds for fallback timeout

    try {
      if (response) {
        const collector = response.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
          filter: (i) => i.customId === characterSelectId,
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

              const characterList = createCharacterList(player);
              const selection = i.values[0];

              let index;
              if (selection === "random") {
                index = Math.floor(Math.random() * characterList.length);
              } else {
                index = parseInt(selection) ?? 0;
              }
              const selectedCharacter = characterList[index].clone();
              const characterSelectedEmbed = new EmbedBuilder()
                .setTitle(
                  `You selected ${selectedCharacter.cosmetic.emoji} **${selectedCharacter.name}**`,
                )
                .setColor(selectedCharacter.cosmetic.color)
                .setImage(selectedCharacter.cosmetic.imageUrl);

              await i.editReply({
                content: `You selected ${selectedCharacter.cosmetic.emoji} **${selectedCharacter.name}**`,
                embeds: [characterSelectedEmbed],
                components: [],
              });

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve(selectedCharacter);
            }
          } catch (error) {
            console.error(error);

            if (!i.replied && !i.deferred) {
              await i.reply({
                content: "There was an error fetching character information.",
                flags: MessageFlags.Ephemeral,
              });
            } else {
              await i.editReply({
                content: "There was an error fetching character information.",
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
          // When the collector expires, disable the select menu
          if (collected.size === 0) {
            if (!isResolved) {
              const timeoutEmbed = EmbedBuilder.from(
                characterDropdown.embed,
              ).setFooter({
                text: "Timeout! You didn't select a character in time.",
              });

              await response
                .edit({
                  embeds: [timeoutEmbed],
                  components: [],
                })
                .catch(() => {});

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve(null);
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
