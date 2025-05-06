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
        ...sortedCharacters.favoritedCharacter.map(
          (char: CharacterData) => `1. ⭐ ${char.cosmetic.emoji} ${char.name}`
        ),
        ...sortedCharacters.nonFavoritedCharacter.map(
          (char: CharacterData) => `1. ${char.cosmetic.emoji} ${char.name}`
        ),
        "?. 🎲 Random Character",
        "?. ✨ Favourite Random Character",
      ].join("\n"),
    });

  const { charSelect, charSelectActionRow } = characterSelect({
    characterList: sortedCharacters.favoritedCharacter.concat(
      sortedCharacters.nonFavoritedCharacter
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
