import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { GAME_SETTINGS } from "../tcgChallenge/gameHandler/gameSettings";
import { handleGlobalStats } from "./statsHandlers/globalStats";
import { handleCharacterGlobalStats } from "./statsHandlers/characterLeaderboard";
import { handleCharacterStats } from "./statsHandlers/characterStats";
import handleAchievementLeaderboard from "./statsHandlers/achievementLeaderboard";
import { CHAR_OPTIONS } from "@src/constants";
import handleUsageStats from "./statsHandlers/handleUsageStats";
import getTables from "@src/util/db/getTables";
import exportTable from "./statsHandlers/exportTable";
import seasonAutocomplete, {
  seasonOption,
} from "./statsHandlers/seasonAutocomplete";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-stats")
    .setDescription("Get stats for TCG ranked games")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leaderboard")
        .setDescription(
          "Get the top player leaderboard for a certain gamemode."
        )
        .addStringOption((option) =>
          option
            .setName("gamemode")
            .setDescription(
              "Select the gamemode to get stats for. Defaults to Classic."
            )
            .addChoices(
              Object.entries(GAME_SETTINGS)
                .filter(([, game]) => game.optionName && game.allowedOption)
                .map(([key, game]) => ({
                  name: game.optionName ?? "optionName should be defined",
                  value: key,
                }))
            )
        )
        .addIntegerOption(seasonOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character-leaderboard")
        .setDescription(
          "Get the character leaderboard for a certain character."
        )
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription("Select the character to get stats for.")
            .setRequired(true)
            .addChoices(CHAR_OPTIONS)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("achievement-leaderboard")
        .setDescription(
          "Get a leaderboard of players with the most achievements."
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character")
        .setDescription("Get match stats for a certain character.")
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription(
              "Select the character to get stats for, defaults to an overview."
            )
            .addChoices(CHAR_OPTIONS)
        )
        .addIntegerOption(seasonOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("usage")
        .setDescription("Usage stats for characters")
        .addIntegerOption(seasonOption)
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("export")
        .setDescription("Export a table from the database")
        .addStringOption((option) =>
          option
            .setName("table")
            .setDescription("The table to export")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      switch (subcommand) {
        case "leaderboard": {
          await handleGlobalStats(interaction);
          break;
        }
        case "character-leaderboard": {
          await handleCharacterGlobalStats(interaction);
          break;
        }
        case "achievement-leaderboard": {
          await handleAchievementLeaderboard(interaction);
          break;
        }
        case "character": {
          const character = interaction.options.getString("character");
          const seasonId = interaction.options.getInteger("season");
          await handleCharacterStats(interaction, character, seasonId);
          break;
        }
        case "usage": {
          await handleUsageStats(interaction);
          break;
        }
        case "export": {
          await exportTable(interaction);
          break;
        }
        default:
          await interaction.editReply({
            content: "Invalid subcommand",
          });
          break;
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "tcg-stats failed",
      });
    }
  },

  async autocomplete(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const focusedValue = interaction.options.getFocused();

    switch (subcommand) {
      case "export": {
        const tables = await getTables();
        const filtered = tables
          .filter((table) =>
            table.toLowerCase().startsWith(focusedValue.toLowerCase())
          )
          .slice(0, 25);
        await interaction.respond(
          filtered.map((table) => ({ name: table, value: table }))
        );
        break;
      }
      case "leaderboard": {
        await seasonAutocomplete(interaction);
        break;
      }
      case "usage": {
        await seasonAutocomplete(interaction);
        break;
      }
      case "character": {
        await seasonAutocomplete(interaction);
        break;
      }
      default: {
        await interaction.respond([]);
        break;
      }
    }
  },
};
