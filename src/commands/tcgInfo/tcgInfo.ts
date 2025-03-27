import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import { showGameHowToPlay } from "./info/gameHowToPlay";
import {
  AdvancedRulesSection,
  showGameAdvancedRules,
} from "./info/gameAdvancedRules";
import { showCharacterInfo } from "./info/characterInfo";
import { showRankingSystem } from "./info/rankingSystem";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-info")
    .setDescription("Get info about the TCG game")
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("how-to-play")
        .setDescription(
          "Get information about the game's rules and how-to-play",
        )
        .addBooleanOption((option) =>
          option
            .setName("detailed")
            .setDescription(
              "Show detailed game rules information. Default: False",
            )
            .setRequired(false),
        )
        .addBooleanOption((option) =>
          option
            .setName("dm")
            .setDescription("DM this information instead. Default: False")
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("advanced-rules")
        .setDescription(
          "Get information about the advanced rules and edge cases",
        )
        .addStringOption((option) =>
          option
            .setName("section")
            .setDescription("Select the section to look up information on.")
            .setRequired(true)
            .addChoices(
              {
                name: "Empowerment and Formulas",
                value: AdvancedRulesSection.EmpowermentAndEffectCalculation,
              },
              {
                name: "Turn Limit, Interactions and Edge Cases",
                value: AdvancedRulesSection.InteractionsAndEdgeCases,
              },
              {
                name: "Serie's Living Grimoire: Offensive Chapter's Card Pool",
                value: AdvancedRulesSection.SeriesPoolOffensive,
              },
              {
                name: "Serie's Living Grimoire: Utility Chapter's Card Pool",
                value: AdvancedRulesSection.SeriesPoolUtility,
              },
            ),
        )
        .addBooleanOption((option) =>
          option
            .setName("dm")
            .setDescription("DM this information instead. Default: False")
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ranking-system")
        .setDescription("Get information about the game's ranking system")
        .addBooleanOption((option) =>
          option
            .setName("dm")
            .setDescription("DM this information instead. Default: False")
            .setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character")
        .setDescription("Get information about the character")
        .addBooleanOption((option) =>
          option
            .setName("dm")
            .setDescription("DM this information instead. Default: False")
            .setRequired(false),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "how-to-play":
          await showGameHowToPlay(interaction);
          break;
        case "advanced-rules":
          await showGameAdvancedRules(interaction);
          break;
        case "ranking-system":
          await showRankingSystem(interaction);
          break;
        case "character":
          await showCharacterInfo(interaction);
          break;
        default:
          await interaction.reply({
            content: "Invalid subcommand",
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
