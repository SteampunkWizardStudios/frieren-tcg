import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
} from "discord.js";
import type { Command } from "../../types/command";
import { initiateChallengeRequest } from "./gameHandler/initiateChallengeRequest";
import { GAME_SETTINGS, GameMode } from "./gameHandler/gameSettings";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-challenge")
    .setDescription("Challenge another user to a duel!")
    .setContexts([InteractionContextType.Guild])
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("The user you want to challenge")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("gamemode")
        .setDescription("Select the gamemode. Defaults to Classic.")
        .setRequired(false)
        .addChoices(
          { name: "Classic - 45s Turn Duration", value: GameMode.CLASSIC },
          { name: "Blitz - 10s Turn Duration", value: GameMode.BLITZ },
          {
            name: "Slow - 2m Turn Duration. Hands and Draws revealed",
            value: GameMode.SLOW,
          },
          {
            name: "PvE - 2m Turn Duration. Public challenged player thread. Cannot be Ranked.",
            value: GameMode.PVE,
          },
        ),
    )
    .addBooleanOption((option) =>
      option
        .setName("ranked")
        .setDescription(
          "Whether players can earn rank points from this match. Defaults to False.",
        )
        .setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const gamemode =
        (interaction.options.getString("gamemode") as GameMode) ??
        GameMode.CLASSIC;
      const ranked = (interaction.options.getBoolean("ranked") && gamemode !== GameMode.PVE) ?? false;
      const gameSettings = GAME_SETTINGS[gamemode];

      initiateChallengeRequest(interaction, gameSettings, ranked);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Failed to start game.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
