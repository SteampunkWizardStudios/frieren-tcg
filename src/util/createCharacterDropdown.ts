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

export const createCharacterDropdown = async (
  user: User,
  customId: string,
  timeLimitSeconds?: number
): Promise<{
  embed: EmbedBuilder;
  selectMenu: StringSelectMenuBuilder;
  dropdown: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  let timeLimitString = null;
  if (timeLimitSeconds) {
    timeLimitString = createCountdownTimestamp(timeLimitSeconds);
  }

  const player = await getPlayer(user.id);

  const sortedCharacters = await getSortedCharactersForPlayer(player.id);

  // 2.5% to include Edel
  if (!(Math.random() < 0.025)) {
	sortedCharacters.favouritedCharacter = sortedCharacters.favouritedCharacter.filter(
	  (char: CharacterData) => char.name !== "Edel"
	);
	sortedCharacters.nonFavouritedCharacter = sortedCharacters.nonFavouritedCharacter.filter(
	  (char: CharacterData) => char.name !== "Edel"
	);
  } else {
	console.log(`${user.username} discovered Edel`);
  }

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
        ...sortedCharacters.favouritedCharacter.map(
          (char: CharacterData) => `1. ⭐ ${char.cosmetic.emoji} ${char.name}`
        ),
        ...sortedCharacters.nonFavouritedCharacter.map(
          (char: CharacterData) => `1. ${char.cosmetic.emoji} ${char.name}`
        ),
        "?. 🎲 Random Character",
        "?. ✨ Random Favourite Character",
      ].join("\n"),
    });

  const { charSelect, charSelectActionRow } = characterSelect({
    characterList: sortedCharacters.favouritedCharacter.concat(
      sortedCharacters.nonFavouritedCharacter
    ),
    includeRandom: true,
    customId,
  });

  return {
    embed,
    selectMenu: charSelect,
    dropdown: charSelectActionRow,
  };
};
