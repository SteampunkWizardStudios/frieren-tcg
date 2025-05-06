import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  User,
} from "discord.js";
import { createCountdownTimestamp } from "./utils";
import { CharacterData } from "../tcg/characters/characterData/characterData";
import { CHARACTER_LIST } from "@tcg/characters/characterList";
import characterSelect from "./messageComponents/characterSelect";
import prismaClient from "@prismaClient";
import { getPlayerPreferences } from "./db/preferences";

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

  const player = await prismaClient.player.upsert({
    where: {
      discordId: user.id,
    },
    create: {
      discordId: user.id,
    },
    update: {},
  });

  let sortedCharacters = CHARACTER_LIST;
  const playerPreferrences = await getPlayerPreferences(player.id);
  if (
    playerPreferrences &&
    playerPreferrences.favouriteCharacters &&
    playerPreferrences.favouriteCharacters.length > 0
  ) {
    const favouritedCharacterNames = new Set(
      playerPreferrences.favouriteCharacters.map((fav) => fav.name)
    );

    sortedCharacters = CHARACTER_LIST.slice().sort((a, b) => {
      const [isAfav, isBfav] = [a, b].map(({ name }) => favouritedCharacterNames.has(name));

      // Sort by favourited characters first, then alpabetically
      if (isAfav && !isBfav) return -1;
      if (!isAfav && isBfav) return 1;

      return a.name.localeCompare(b.name);
    });
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
        ...sortedCharacters.map(
          (char: CharacterData) => `1. ${char.cosmetic.emoji} ${char.name}`
        ),
        "?. 🎲 Random Character",
      ].join("\n"),
    });

  const { charSelect, charSelectActionRow } = characterSelect({
    characterList: sortedCharacters,
    includeRandom: true,
    customId,
  });

  return {
    embed,
    selectMenu: charSelect,
    dropdown: charSelectActionRow,
  };
};
