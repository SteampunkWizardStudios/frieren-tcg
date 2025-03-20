// src/commands/info.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import type { Command } from "../../types/command";
import { showGameInfo } from "./info/info";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg")
    .setDescription("Commands for the TCG game")
    .addSubcommandGroup((group) =>
      group
        .setName("info")
        .setDescription("Get information about the game")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("how-to-play")
            .setDescription(
              "Get information about the game's rules and how-to-play",
            )
            .addBooleanOption((option) =>
              option
                .setName("detailed")
                .setDescription("Show detailed game rules information")
                .setRequired(false),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("advanced-rules")
            .setDescription(
              "Get information about the advanced rules and edge cases",
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("ranking-system")
            .setDescription("Get information about the game's ranking system"),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("character")
            .setDescription("Get information about the character"),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();

    try {
      switch (subcommandGroup) {
        case "info":
          await showGameInfo(interaction);
          break;
        default:
          await interaction.reply({
            content: "Invalid subcommand group",
            flags: MessageFlags.Ephemeral,
          });
          break;
      }
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
