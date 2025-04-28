import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import handlePlayerProfile from "./playerHandlers/profileHandler";

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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
		switch (subcommand) {
			case "profile":
				await handlePlayerProfile(interaction);
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
