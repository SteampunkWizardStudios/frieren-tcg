import { PlayerPreferences, Character } from "@prisma/client";
import prismaClient from "@prismaClient";
import {
  CHARACTER_LIST,
  CHARACTER_MAP,
} from "@src/tcg/characters/characterList";
import type { CharacterName } from "@src/tcg/characters/metadata/CharacterName";

/**
 * Gets a player's preferences, including their favourite characters.
 * If the player doesn't have a preferences record, it will return null.
 * @param playerId The ID of the player.
 * @returns The PlayerPreferences object with favourite characters, or null.
 */
export async function getPlayerPreferences(
  playerId: number
): Promise<(PlayerPreferences & { favouriteCharacters: Character[] }) | null> {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: {
        playerId: playerId,
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error(`Error fetching preferences for player ${playerId}:`, error);
    throw error;
  }
}

/**
 * Gets a player's preferences, creating a default record if it doesn't exist.
 * Useful when you always expect a preferences record to be available.
 * @param playerId The ID of the player.
 * @returns The PlayerPreferences object with favourite characters.
 */
export async function getOrCreatePlayerPreferences(
  playerId: number
): Promise<PlayerPreferences & { favouriteCharacters: Character[] }> {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: {
        playerId: playerId,
      },
      update: {},
      create: {
        playerId: playerId,
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return preferences;
  } catch (error) {
    console.error(
      `Error getting or creating preferences for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates the TCG text speed preference for a player.
 * Creates a preferences record if one doesn't exist.
 * @param playerId The ID of the player.
 * @param speed The new TCG text speed value.
 * @returns The updated PlayerPreferences object.
 */
export async function updateTcgTextSpeed(
  playerId: number,
  speed: number
): Promise<PlayerPreferences> {
  try {
    const updatedPreferences = await prismaClient.playerPreferences.upsert({
      where: {
        playerId: playerId,
      },
      update: {
        tcgTextSpeed: speed,
      },
      create: {
        playerId: playerId,
        tcgTextSpeed: speed,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error updating TCG text speed for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Adds a character to a player's list of favourite characters.
 * Creates a preferences record if one doesn't exist.
 * @param playerId The ID of the player.
 * @param characterId The ID of the character to add as favourite.
 * @returns The updated PlayerPreferences object with the new favourite character included.
 */
export async function addFavouriteCharacter(
  playerId: number,
  characterId: number
): Promise<PlayerPreferences & { favouriteCharacters: Character[] }> {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: { playerId: playerId },
      update: {},
      create: { playerId: playerId },
    });

    const updatedPreferences = await prismaClient.playerPreferences.update({
      where: { id: preferences.id },
      data: {
        favouriteCharacters: {
          connect: { id: characterId },
        },
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error adding favourite character ${characterId} for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 * Removes a character from a player's list of favourite characters.
 * @param playerId The ID of the player.
 * @param characterId The ID of the character to remove from favourites.
 * @returns The updated PlayerPreferences object with the character removed.
 */
export async function removeFavouriteCharacter(
  playerId: number,
  characterId: number
): Promise<PlayerPreferences & { favouriteCharacters: Character[] }> {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: { playerId: playerId },
    });

    if (!preferences) {
      console.warn(
        `Attempted to remove favourite character for player ${playerId} but no preferences record found.`
      );
      return await prismaClient.playerPreferences.findUniqueOrThrow({
        where: { playerId: playerId },
        include: { favouriteCharacters: true },
      });
    }

    const updatedPreferences = await prismaClient.playerPreferences.update({
      where: { id: preferences.id },
      data: {
        favouriteCharacters: {
          disconnect: { id: characterId },
        },
      },
      include: {
        favouriteCharacters: true,
      },
    });
    return updatedPreferences;
  } catch (error) {
    console.error(
      `Error removing favourite character ${characterId} for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 *
 * @param playerId The ID of the player.
 * @param characterIds The IDs of the characters to allow.
 * @returns The updated {@link PlayerPreferences} object.
 */
export async function setAllowedRandomCharacters(
  playerId: number,
  characterIds: number[]
) {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: { playerId },
      update: {},
      create: {
        playerId,
        allowedRandomCharacters: {
          connect: characterIds.map((id) => ({ id })),
        },
      },
    });

    return preferences;
  } catch (error) {
    console.error(
      `Error setting allowed random characters for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 *
 * @param playerId The ID of the player.
 * @returns {@link CharacterData[]} for the player's allowed random characters.
 */
export async function getAllowedRandomCharacters(playerId: number) {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: { playerId },
      select: {
        allowedRandomCharacters: {
          select: { name: true },
        },
      },
    });

    const chars = preferences?.allowedRandomCharacters ?? [];
    return chars.map((char) => CHARACTER_MAP[char.name as CharacterName]);
  } catch (error) {
    console.error(
      `Error getting allowed random characters for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 *
 * @param playerId The ID of the player.
 * @param newVal The new value for the restrictRandomToFavourites preference.
 * @returns The updated {@link PlayerPreferences} object.
 */
export async function setRistrictRandomToFavourites(
  playerId: number,
  newVal: boolean
) {
  try {
    const preferences = await prismaClient.playerPreferences.upsert({
      where: { playerId },
      update: { restrictRandomToFavourites: newVal },
      create: {
        playerId,
        restrictRandomToFavourites: newVal,
      },
    });

    return preferences;
  } catch (error) {
    console.error(
      `Error setting restrict random to favourites for player ${playerId}:`,
      error
    );
    throw error;
  }
}

/**
 *
 * @param playerId The ID of the player.
 * @returns {@link PlayerPreferences} object for the player.
 */
export async function getRestrictRandomToFavourites(playerId: number) {
  try {
    const preferences = await prismaClient.playerPreferences.findUnique({
      where: { playerId },
      select: {
        restrictRandomToFavourites: true,
      },
    });

    return preferences?.restrictRandomToFavourites ?? false;
  } catch (error) {
    console.error(
      `Error getting restrict random to favourites for player ${playerId}:`,
      error
    );
    throw error;
  }
}

export async function getSortedCharactersForPlayer(playerId: number) {
  let sortedCharacters = CHARACTER_LIST;
  const playerPreferrences = await getPlayerPreferences(playerId);
  if (
    playerPreferrences &&
    playerPreferrences.favouriteCharacters &&
    playerPreferrences.favouriteCharacters.length > 0
  ) {
    const favouritedCharacterNames = new Set(
      playerPreferrences.favouriteCharacters.map((fav) => fav.name)
    );

    const favouritedOnly = [];
    const nonFavouritedOnly = [];

    for (const character of CHARACTER_LIST) {
      if (favouritedCharacterNames.has(character.name)) {
        favouritedOnly.push(character);
      } else {
        nonFavouritedOnly.push(character);
      }
    }

    sortedCharacters = favouritedOnly.concat(nonFavouritedOnly);
  }

  return sortedCharacters;
}
