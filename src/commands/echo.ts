import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "@src/types/command";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const input = interaction.options.getString("input");
    await interaction.reply(input ?? "No input");
  },
};
