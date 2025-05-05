import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import handlePlayerProfile from "./playerHandlers/profileHandler";
import handleMatchHistory from "./playerHandlers/matchHandler";
import { handlePlayerPreferences } from "./playerHandlers/preferencesHandler";
import { CHAR_OPTIONS, MAX_TEXT_SPEED, MIN_TEXT_SPEED } from "@src/constants";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-player")
    .setDescription("Get information about a TCG player")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("profile")
        .setDescription(
          "Get a player's profile with ladder ranks, achievements, and character masteries"
        )
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player to get the profile of, defaults to yourself"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("match-history")
        .setDescription("Get a player's match history")
        .addUserOption((option) =>
          option
            .setName("player")
            .setDescription(
              "The player to get the match history of, defaults to yourself"
            )
        )
    )
    .addSubcommandGroup((subcommand) =>
      subcommand
        .setName("preferences")
        .setDescription("Manage your preferences")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("view")
            .setDescription("View your current player preferences")
        )
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
                .setDescription(
                  "The name of the character to toggle as favourite"
                )
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
                .setDescription(
                  "Restrict random character selection to favourites"
                )
                .setRequired(true)
            )
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      // sub commands
      switch (subcommand) {
        case "profile":
          {
            await handlePlayerProfile(interaction);
          }
          break;
        case "match-history":
          {
            await handleMatchHistory(interaction);
          }
          break;
      }

      // sub command groups
      switch (subcommandGroup) {
        case "preferences": {
          await handlePlayerPreferences(interaction);
        }
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
