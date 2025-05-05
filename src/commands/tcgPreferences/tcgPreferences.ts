import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { handlePlayerPreferences } from "./preferencesHandlers/preferencesHandler";
import { CHAR_OPTIONS, MAX_TEXT_SPEED, MIN_TEXT_SPEED } from "@src/constants";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-preferences")
    .setDescription("Manage your preferences")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-text-speed")
        .setDescription("Set your preferred TCG text display speed")
        .addIntegerOption((option) =>
          option
            .setName("speed")
            .setDescription(
              "The text speed (e.g., 500 for fast, 2000 for slow - in milliseconds)"
            )
            .setRequired(true)
            .setMinValue(MIN_TEXT_SPEED)
            .setMaxValue(MAX_TEXT_SPEED)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle-favorite-character")
        .setDescription(
          "Add or remove a character from your list of favourite characters"
        )
        .addStringOption((option) =>
          option
            .setName("character-name")
            .setDescription("The name of the character to toggle as favourite")
            .setRequired(true)
            .addChoices(CHAR_OPTIONS)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("restrict-random-to-favourites")
        .setDescription("Restrict random character selection to favourites")
        .addBooleanOption((option) =>
          option
            .setName("value")
            .setDescription("Restrict random character selection to favourites")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View your current player preferences")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      handlePlayerPreferences(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
