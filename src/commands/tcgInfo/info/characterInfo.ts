import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ComponentType,
} from "discord.js";
import { characterList } from "../../../tcg/characters/characterList";
import { sendInfoMessage } from "./util/sendInfoMessage";
import { statDetails } from "../../../tcg/formatting/emojis";

export async function showCharacterInfo(
  interaction: ChatInputCommandInteraction,
) {
  const dm = interaction.options.getBoolean("dm") ? true : false;

  try {
    // Create the initial embed showing all characters
    const initialEmbed = new EmbedBuilder()
      .setColor(0xc5c3cc)
      .setTitle("Frieren TCG - Characters")
      .setDescription(
        "Select a character from the dropdown menu below to view their details.",
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

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    // Send initial message with the menu
    const response = await sendInfoMessage(
      interaction,
      initialEmbed,
      [row],
      dm,
    );

    // Create a collector for the dropdown menu
    if (response) {
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 300000, // 5 minutes
      });

      collector.on("collect", async (i: StringSelectMenuInteraction) => {
        try {
          // Verify that the interaction is from the original user
          if (i.user.id !== interaction.user.id) {
            await i.reply({
              content: "Invalid user.",
              ephemeral: true,
            });
            return;
          }
          const char = characterList[parseInt(i.values[0]) ?? 0];

          // Create new embed for the selected character
          const deckString = char.cards.map((cardCount) => {
            const card = cardCount.card;
            const count = cardCount.count;
            return `${card.emoji} **${card.title}** x ${count}:\n${card.getDescription()}`;
          });
          const characterEmbed = new EmbedBuilder()
            .setColor(char.cosmetic.color)
            .setTitle(`${char.deck.activePile[0].emoji} ${char.name}`)
            .setTimestamp()
            .setThumbnail(char.cosmetic.imageUrl)
            .addFields(
              {
                name: "Stats",
                value: [
                  `- ${statDetails.HP.emoji} **HP**: ${char.stats.stats.HP}`,
                  `- ${statDetails.ATK.emoji} **ATK**: ${char.stats.stats.ATK}`,
                  `- ${statDetails.DEF.emoji} **DEF**: ${char.stats.stats.DEF}`,
                  `- ${statDetails.SPD.emoji} **SPD**: ${char.stats.stats.SPD}`,
                ].join("\n"),
              },
              {
                name: `Ability: ${char.ability.abilityName}`,
                value: `${char.ability.abilityEffectString}`,
              },
              {
                name: `Deck: 15 Cards`,
                value: "",
              },
            )
            .addFields(
              char.cards.map((cardCount) => {
                const card = cardCount.card;
                const count = cardCount.count;
                return {
                  name: `${card.emoji} **${card.title}** x ${count}:`,
                  value: `${card.getDescription()}`,
                };
              }),
            );

          await i.update({
            embeds: [characterEmbed],
            components: [row], // Keep the dropdown menu
          });
        } catch (error) {
          console.error(error);
          await i.reply({
            content: "There was an error while fetching character information.",
            ephemeral: true,
          });
        }
      });

      collector.on("end", async () => {
        // When the collector expires, disable the select menu
        selectMenu.setDisabled(true);
        const disabledRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            selectMenu,
          );

        await interaction
          .editReply({
            components: [disabledRow],
          })
          .catch(() => {
            // Ignore any errors if the message was deleted
          });
      });
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "There was an error while fetching character information.",
        ephemeral: true,
      });
    }
  }
}
