import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { showGameHowToPlay } from "./gameHowToPlay";
import { showGameAdvancedRules } from "./gameAdvancedRules";

export async function showGameInfo(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "how-to-play":
      await showGameHowToPlay(interaction);
      break;
    case "advanced-rules":
      await showGameAdvancedRules(interaction);
      break;
    case "ranking-system":
      await interaction.reply({
        content: "Rank input",
        flags: MessageFlags.Ephemeral,
      });
      break;
    case "character":
      await interaction.reply({
        content: "Character input",
        flags: MessageFlags.Ephemeral,
      });
      break;
    default:
      await interaction.reply({
        content: "Invalid subcommand",
        flags: MessageFlags.Ephemeral,
      });
      break;
  }
}
