import { StringSelectMenuBuilder, ActionRowBuilder } from "discord.js";
import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";

export default function characterSelect({
  characterList = VISIBLE_CHARACTERS,
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
      characterList.map((char, i) => ({
        label: char.name,
        value: nameValues ? char.name : `${i}`,
        emoji: char.cosmetic.emoji,
      }))
    );

  if (includeRandom) {
    charSelect.addOptions(
      {
        label: "Random Character",
        value: "random",
        emoji: "🎲",
      },
      {
        label: "Random Favourite Character",
        value: "random-favourite",
        emoji: "✨",
      }
    );
  }

  const charSelectActionRow =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(charSelect);

  return { charSelect, charSelectActionRow };
}
