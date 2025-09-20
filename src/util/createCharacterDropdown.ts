import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  User,
} from "discord.js";
import { createCountdownTimestamp } from "./utils";
import { CharacterData } from "../tcg/characters/characterData/characterData";
import characterSelect from "./messageComponents/characterSelect";
import { getSortedCharactersForPlayer } from "./db/preferences";
import { getPlayer } from "./db/getPlayer";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { charWithEmoji } from "@tcg/formatting/emojis";

export const createCharacterDropdown = async (
  user: User,
  customId: string,
  timeLimitSeconds?: number,
  options?: { bannedCharacters?: Set<CharacterName> }
): Promise<{
  embed: EmbedBuilder;
  selectMenu: StringSelectMenuBuilder;
  dropdown: ActionRowBuilder<StringSelectMenuBuilder>;
  characterListUsed: CharacterData[];
}> => {
  let timeLimitString = null;
  if (timeLimitSeconds) {
    timeLimitString = createCountdownTimestamp(timeLimitSeconds);
  }

  const player = await getPlayer(user.id);

  const sortedCharacters = await getSortedCharactersForPlayer(player.id);
  const bannedCharacters = options?.bannedCharacters ?? new Set<CharacterName>();

  const availableFavouriteCharacters = sortedCharacters.favouritedCharacter.filter(
    (char) => !bannedCharacters.has(char.characterName as CharacterName)
  );
  const availableNonFavouriteCharacters =
    sortedCharacters.nonFavouritedCharacter.filter(
      (char) => !bannedCharacters.has(char.characterName as CharacterName)
    );

  // Create the initial embed showing all characters
  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTitle("Frieren TCG - Characters")
    .setDescription(
      `${timeLimitString ? `${timeLimitString} to ` : ""}Choose your character.`
    )
    .addFields({
      name: "Available Characters",
      value: [
        "🎲 Random Character",
        "✨ Random Favorite Character", // Still using british spelling in the codebase
        ...availableFavouriteCharacters.map(
          (char: CharacterData) =>
            `1. ⭐ ${char.cosmetic.emoji} ${char.characterName}`
        ),
        ...availableNonFavouriteCharacters.map(
          (char: CharacterData) =>
            `1. ${char.cosmetic.emoji} ${char.characterName}`
        ),
      ].join("\n"),
    });

  if (bannedCharacters.size > 0) {
    embed.addFields({
      name: "🚫 Banned This Match",
      value: Array.from(bannedCharacters)
        .sort((a, b) => a.localeCompare(b))
        .map((charName) => `- ${charWithEmoji(charName)}`)
        .join("\n"),
    });
  }

  const characterList = availableFavouriteCharacters.concat(
    availableNonFavouriteCharacters
  );
  const { charSelect, charSelectActionRow } = characterSelect({
    characterList,
    includeRandom: true,
    customId,
  });

  return {
    embed,
    selectMenu: charSelect,
    dropdown: charSelectActionRow,
    characterListUsed: characterList,
  };
};
