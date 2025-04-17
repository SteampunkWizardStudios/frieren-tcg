import { StringSelectMenuBuilder, ActionRowBuilder } from "discord.js";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";

export default function characterSelect({ includeRandom = false, customId = "character-select" }) {
    const charSelect = new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder("Select a Character")
        .addOptions(
            CHARACTER_LIST.map((char, i) => ({
                label: char.name,
                value: `${i}`,
                emoji: char.cosmetic.emoji,
            })
            ));

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