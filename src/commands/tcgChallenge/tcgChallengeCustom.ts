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
    .addIntegerOption((option) =>
      option
        .setName("turn-duration-seconds")
        .setDescription("The turn duration in seconds. Min: 1. Max: 300")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-hand")
        .setDescription("Whether the player's hands are revealed.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("reveal-active-card")
        .setDescription("Whether the player's active cards are revealed.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user you want to challenge")
    )
    .addIntegerOption((option) =>
      option
        .setName("text_speed_ms")
        .setDescription(
          "What the delay between game messages should be in ms. Defaults to 1500ms."
        )
        .setMinValue(100)
        .setMaxValue(3000)
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const turnDurationSeconds = Math.max(
        Math.min(
          interaction.options.getInteger("turn-duration-seconds") ?? 45,
          300
        ),
        1
      );
      const revealHand = interaction.options.getBoolean("reveal-hand") ?? false;
      const revealDraw =
        interaction.options.getBoolean("reveal-active-card") ?? false;
      const textSpeedMs =
        interaction.options.getInteger("text_speed_ms") ?? 1500;

      initiateChallengeRequest({
        interaction,
        gameSettings: {
          turnDurationSeconds,
          revealHand,
          revealDraw,
        },
        ranked: false,
        gamemode: undefined,
        textSpeedMs,
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Failed to start game.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
