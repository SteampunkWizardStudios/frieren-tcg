import {
  ComponentType,
  EmbedBuilder,
  MessageFlags,
  StringSelectMenuInteraction,
  ThreadChannel,
  User,
} from "discord.js";
import { createCharacterDropdown } from "@src/util/createCharacterDropdown";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { CHARACTER_LIST, CHARACTER_MAP } from "@tcg/characters/characterList";
import { getPlayerPreferences } from "@src/util/db/preferences";
import { getPlayer } from "@src/util/db/getPlayer";
import type { CharacterName } from "@src/tcg/characters/metadata/CharacterName";

export enum CharacterSelectionType {
  Selection,
  Random,
  FavouriteRandom,
}

export const getPlayerCharacter = async (
  player: User,
  playerThread: ThreadChannel<false>
): Promise<{
  char: CharacterData;
  selectionType: CharacterSelectionType;
} | null> => {
  const timeLimitSeconds = 60;
  const timeLimit = timeLimitSeconds * 1000;
  let isResolved = false;

  const characterSelectId = `character-select-${player.id}-${Date.now()}`;
  const characterDropdown = await createCharacterDropdown(
    player,
    characterSelectId,
    timeLimitSeconds
  );

  const response = await playerThread.send({
    embeds: [characterDropdown.embed],
    components: [characterDropdown.dropdown],
  });

  return new Promise<{
    char: CharacterData;
    selectionType: CharacterSelectionType;
  } | null>((resolve, reject) => {
    const fallbackTimeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        console.warn(
          "Fallback timeout triggered in getPlayerCharacter function - collector failed to end properly."
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

              const characterList = CHARACTER_LIST;
              const selection = i.values[0];
              let selectionType = CharacterSelectionType.Selection;

              let selectedCharacter: CharacterData;
              const player = await getPlayer(i.user.id);
              const preferences = await getPlayerPreferences(player.id);

              if (selection === "random") {
                selectionType = CharacterSelectionType.Random;
                const index = Math.floor(Math.random() * characterList.length);
                selectedCharacter = characterList[index];
              } else if (selection === "favourite-random") {
                if (preferences && preferences.favouriteCharacters.length > 0) {
                  selectionType = CharacterSelectionType.FavouriteRandom;

                  const favouriteCharacters = preferences.favouriteCharacters;
                  const randomFavouriteCharacter =
                    favouriteCharacters[
                      Math.floor(Math.random() * favouriteCharacters.length)
                    ];

                  selectedCharacter =
                    CHARACTER_MAP[
                      randomFavouriteCharacter.name as CharacterName
                    ];
                } else {
                  const index = Math.floor(
                    Math.random() * characterList.length
                  );
                  selectedCharacter = characterList[index];
                }
              } else {
                const index = Math.floor(Math.random() * characterList.length);
                selectedCharacter = characterList[index];
              }

              // Error message if player tried to pick random favourite character when they have no favourited characters
              const errorMessage = `You have no favourite characters. Please add some by using the \`/tcg-preferences toggle-favourite-character\` command.`;
              const shouldSendErrorMessage =
                preferences &&
                preferences.favouriteCharacters.length === 0 &&
                selection === "favourite-random";

              const characterSelectedEmbed = new EmbedBuilder()
                .setTitle(
                  `You selected ${selectedCharacter.cosmetic.emoji} **${selectedCharacter.name}**`
                )
                .setColor(selectedCharacter.cosmetic.color)
                .setImage(selectedCharacter.cosmetic.imageUrl);

              await i.editReply({
                content: `You selected ${selectedCharacter.cosmetic.emoji} **${selectedCharacter.name}**\n\n${shouldSendErrorMessage ? errorMessage : ""}`,
                embeds: [characterSelectedEmbed],
                components: [],
              });

              isResolved = true;
              clearTimeout(fallbackTimeout);
              resolve({
                char: selectedCharacter,
                selectionType: selectionType,
              });
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
                characterDropdown.embed
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
