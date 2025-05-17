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
import Edel from "@src/tcg/characters/characterData/characters/Edel";

export const createCharacterDropdown = async (
  user: User,
  customId: string,
  timeLimitSeconds?: number
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

  // 5% chance to include Edel
  if (Math.random() < 0.05) {
    sortedCharacters.nonFavouritedCharacter.push(Edel);
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

  const characterList = sortedCharacters.favouritedCharacter.concat(
    sortedCharacters.nonFavouritedCharacter
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
