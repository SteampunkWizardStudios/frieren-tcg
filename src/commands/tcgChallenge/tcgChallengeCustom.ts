import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import { initiateChallengeRequest } from "./gameHandler/initiateChallengeRequest";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-custom-challenge")
    .setDescription("Challenge another user to a custom duel!")
    .setContexts([InteractionContextType.Guild])
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user you want to challenge")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("turn-duration-seconds")
        .setDescription("The turn duration in seconds")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-hand")
        .setDescription("Whether the player's hands are revealed.")
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-draw")
        .setDescription("Whether the player's draws are revealed.")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const turnDurationSeconds = interaction.options.getInteger("turn-duration-seconds") ?? 45;
      const revealHand = interaction.options.getBoolean("reveal-hand") ?? false;
      const revealDraw = interaction.options.getBoolean("reveal-draw") ?? false;

      initiateChallengeRequest(
        interaction, 
        {
          turnDurationSeconds,
          revealHand,
          revealDraw,
        }, 
        false
      );
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Failed to start game.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
