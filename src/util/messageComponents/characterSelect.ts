import { StringSelectMenuBuilder, ActionRowBuilder } from "discord.js";
import { CHARACTER_LIST } from "@tcg/characters/characterList";

export default function characterSelect({
  includeRandom = false,
  includeOverview = false,
  customId = "character-select",
  nameValues = false,
}) {
  const charSelect = new StringSelectMenuBuilder();

  if (includeOverview) {
    charSelect.addOptions({
      label: "Overview",
      value: "overview",
      emoji: "📊",
    });
  }

  charSelect
    .setCustomId(customId)
    .setPlaceholder("Select a Character")
    .addOptions(
      CHARACTER_LIST.map((char, i) => ({
        label: char.name,
        value: nameValues ? char.name : `${i}`,
        emoji: char.cosmetic.emoji,
      }))
    );

  if (includeRandom) {
    charSelect.addOptions({
      label: "Random Character",
      value: "random",
      emoji: "🎲",
    });
  }

  const charSelectActionRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(charSelect);

  return { charSelect, charSelectActionRow };
}
