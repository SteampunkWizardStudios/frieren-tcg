import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import handleAchievementAutocomplete from "./achievementHandler/handleAchievementAutocomplete";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-admin")
    .setDescription("Admin commands for TCG game")
    .setContexts([InteractionContextType.Guild])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("grant-achievement")
        .setDescription("Grant an achievement to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to grant the achievement to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("achievement")
            .setDescription("Achievement to grant")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "grant-achievement":
          await interaction.deferReply({
            ephemeral: true,
          });

          // handle

          await interaction.editReply({
            content: "Achievement granted successfully.",
          });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  async autocomplete(interaction) {
    try {
      return await handleAchievementAutocomplete(interaction);
    } catch (error) {
      console.error("Error in achievement autocomplete:", error);
      await interaction.respond([]);
    }
  },
};
