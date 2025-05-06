import type { CharacterData } from "@src/tcg/characters/characterData/characterData";
import { CHARACTER_MAP } from "@src/tcg/characters/characterList";
import type { CharacterName } from "@src/tcg/characters/metadata/CharacterName";
import { getPlayer } from "@src/util/db/getPlayer";
import {
  getPlayerPreferences,
  getSortedCharactersForPlayer,
} from "@src/util/db/preferences";
import type { StringSelectMenuInteraction } from "discord.js";

export async function handleCharacterSelection(
  interaction: StringSelectMenuInteraction,
  preferences: Awaited<ReturnType<typeof getPlayerPreferences>> | null // Damn
): Promise<{
  selectedCharacter: CharacterData;
  selectionType: CharacterSelectionType;
}> {
  const selection = interaction.values[0] as
    | `${number}`
    | "random"
    | "random-favourite";

  let selectionType: CharacterSelectionType;
  let selectedCharacter: CharacterData;

  const player = await getPlayer(interaction.user.id);
  const characters = await getSortedCharactersForPlayer(player.id);
  const characterList = characters.favoritedCharacter.concat(
    characters.nonFavoritedCharacter
  );

  if (selection === "random") {
    selectionType = CharacterSelectionType.Random;
    const index = Math.floor(Math.random() * characterList.length);
    selectedCharacter = characterList[index];
  } else if (selection === "random-favourite") {
    if (preferences && preferences.favouriteCharacters.length > 0) {
      selectionType = CharacterSelectionType.FavouriteRandom;
      const favouriteCharacters = preferences.favouriteCharacters;
      const randomFavouriteCharacter =
        favouriteCharacters[
          Math.floor(Math.random() * favouriteCharacters.length)
        ];
      selectedCharacter =
        CHARACTER_MAP[randomFavouriteCharacter.name as CharacterName];
    } else {
      selectionType = CharacterSelectionType.Random;
      const index = Math.floor(Math.random() * characterList.length);
      selectedCharacter = characterList[index];
      console.log(
        "Favourite random selected but no favourites found, falling back to standard random."
      );
    }
  } else {
    selectionType = CharacterSelectionType.Selection;
    const index = parseInt(selection);

    if (isNaN(index) || index < 0 || index >= characterList.length) {
      console.error(
        `Invalid character index received for selection: ${selection}. Defaulting to the first character.`
      );
      selectedCharacter = characterList[0];
    } else {
      selectedCharacter = characterList[index];
    }
  }

  // At this point, selectedCharacter and selectionType are guaranteed to be assigned
  return {
    selectedCharacter,
    selectionType,
  };
}

export const enum CharacterSelectionType {
  Selection,
  Random,
  FavouriteRandom,
}
