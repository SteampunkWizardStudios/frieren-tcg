import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { characterList } from "../tcg/characters/characterList";
import { createCountdownTimestamp } from "./utils";

export const createCharacterDropdown = async (
  timeLimitSeconds?: number,
): Promise<{
  embed: EmbedBuilder;
  selectMenu: StringSelectMenuBuilder;
  dropdown: ActionRowBuilder<StringSelectMenuBuilder>;
}> => {
  let timeLimitString = null;
  if (timeLimitSeconds) {
    timeLimitString = createCountdownTimestamp(timeLimitSeconds);
  }

  // Create the initial embed showing all characters
  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTitle("Frieren TCG - Characters")
    .setDescription(
      `${timeLimitString ? `${timeLimitString} to ` : ""}Choose your character.`,
    )
    .addFields({
      name: "Available Characters",
      value: characterList
        .map((char) => `1. ${char.cosmetic.emoji} ${char.name}`)
        .join("\n"),
    });

  // Create the dropdown menu
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("character-select")
    .setPlaceholder("Select a Character")
    .addOptions(
      characterList.map((char, index) => ({
        label: `${char.name}`,
        value: `${index}`,
        emoji: char.cosmetic.emoji,
      })),
    );

  const dropdown =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  return {
    embed,
    selectMenu,
    dropdown,
  };
};
