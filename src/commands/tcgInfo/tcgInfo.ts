import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import { showGameHowToPlay } from "./info/gameHowToPlay";
import {
  AdvancedRulesSection,
  showGameAdvancedRules,
} from "./info/gameAdvancedRules";
import { showGameExtraGuide } from "./info/gameExtraGuide";
import { showCharacterInfo } from "./info/characterInfo";
import { showRankingSystem } from "./info/rankingSystem";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-info")
    .setDescription("Get info about the TCG game")
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guide")
        .setDescription("Get information about the game and how to play")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guide-extra")
        .setDescription(
          "A guide on extra rules, edge cases and mechanics. Read after the regular guide."
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("advanced-rules")
        .setDescription(
          "Get information about the advanced rules and edge cases"
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
                name: "Serie's Living Grimoire: Offense Chapter's Card Pool",
                value: AdvancedRulesSection.SeriesPoolOffense,
              },
              {
                name: "Serie's Living Grimoire: Utility Chapter's Card Pool",
                value: AdvancedRulesSection.SeriesPoolUtility,
              },
              {
                name: "Character signature moves: Übel's Empathy Transformations",
                value: AdvancedRulesSection.SignatureMoves,
              }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ranking-system")
        .setDescription("Get information about the game's ranking system")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character")
        .setDescription("Get information about a character")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "guide":
          await showGameHowToPlay(interaction);
          break;
        case "guide-extra":
          await showGameExtraGuide(interaction);
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
