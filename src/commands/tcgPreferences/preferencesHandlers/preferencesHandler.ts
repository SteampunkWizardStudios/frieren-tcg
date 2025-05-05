import { CHARACTER_MAP } from "@tcg/characters/characterList";
import type { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { findCharacterByName } from "@src/util/db/getCharacter";
import {
  addFavouriteCharacter,
  getOrCreatePlayerPreferences,
  removeFavouriteCharacter,
  setRistrictRandomToFavourites,
  updateTcgTextSpeed,
} from "@src/util/db/preferences";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import { getPlayer } from "@src/util/db/getPlayer";

export async function handlePlayerPreferences(
  interaction: ChatInputCommandInteraction
) {
  const preferenceAction = interaction.options.getSubcommand();
  const player = await getPlayer(interaction.user.id);

  const playerId = player.id;

  try {
    switch (preferenceAction) {
      case "view": {
        const preferences = await getOrCreatePlayerPreferences(playerId);
        const favouriteCharacterData = preferences.favouriteCharacters.map(
          (char) => CHARACTER_MAP[char.name as CharacterName]
        );
        let response = "";
        response += `Text Speed: \`${preferences.tcgTextSpeed} ms\`\n`;

        if (preferences.favouriteCharacters.length > 0) {
          response += `Favourite Characters: ${favouriteCharacterData.map((char) => `${char.cosmetic.emoji} ${char.name}`).join(", ")}\n`;
        } else {
          response += `Favourite Characters: None\n`;
        }

        response += `Restrict Random to Favourites: \`${preferences.restrictRandomToFavourites ? "Yes" : "No"}\`\n`;

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setTitle("Player Preferences")
              .setDescription(response),
          ],
        });
        break;
      }

      case "set-text-speed": {
        const speed = interaction.options.getInteger("speed", true);
        await updateTcgTextSpeed(playerId, speed);
        await interaction.editReply({
          content: `Your TCG text speed preference has been set to \`${speed} ms\`.`,
        });
        break;
      }

      case "toggle-favorite-character": {
        const characterName = interaction.options.getString(
          "character-name",
          true
        );
        const character = await findCharacterByName(characterName);

        if (!character) {
          await interaction.editReply({
            content: `Character "${characterName}" not found.`,
          });
          return;
        }

        const characterData = CHARACTER_MAP[character.name as CharacterName];

        const currentPreferences = await getOrCreatePlayerPreferences(playerId);
        const isCurrentlyFavorite = currentPreferences.favouriteCharacters.some(
          (char) => char.id === character.id
        );

        if (isCurrentlyFavorite) {
          removeFavouriteCharacter(playerId, character.id);
          await interaction.editReply({
            content: `${characterData.cosmetic.emoji} "${character.name}" has been removed from your favourite characters.`,
          });
        } else {
          addFavouriteCharacter(playerId, character.id);
          await interaction.editReply({
            content: `${characterData.cosmetic.emoji}"${character.name}" has been added to your favourite characters.`,
          });
        }
        break;
      }
      case "restrict-random-to-favourites": {
        const value = interaction.options.getBoolean("value", true);
        await setRistrictRandomToFavourites(playerId, value);
        await interaction.editReply({
          content: `Your random character selection preference has been set to ${value ? "" : "not "}restricted to your favourite characters.`,
        });
        break;
      }

      default:
        await interaction.editReply({
          content: "Invalid preferences subcommand.",
        });
    }
  } catch (error) {
    console.error("Error handling player preferences:", error);
    await interaction.editReply({
      content: "An error occurred while managing your preferences.",
    });
  }
}
