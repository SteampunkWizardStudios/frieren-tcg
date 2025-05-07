import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "@src/types/command";
import showEmojiList from "./metaHandlers/showEmojiList";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-meta")
    .setDescription("Get meta information about the TCG game")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("emojis")
        .setDescription("Display a list of emojis used in the TCG")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case "emojis":
          await showEmojiList(interaction);
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
