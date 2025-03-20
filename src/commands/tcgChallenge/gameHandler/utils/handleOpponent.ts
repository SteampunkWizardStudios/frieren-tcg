import { ChatInputCommandInteraction, MessageFlags, User } from "discord.js";

export const handleOpponent = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null
): Promise<boolean> => {
  if (!opponent) {
    await interaction.reply({
      content: "Please specify an opponent to challenge.",
      flags: MessageFlags.Ephemeral,
    })
    return false;
  }

  if (opponent.bot) {
    await interaction.reply({
      content: "You cannot challenge a bot.",
      flags: MessageFlags.Ephemeral,
    })
    return false;
  }

  if (opponent.id === challenger.id) {
    await interaction.reply({
      content: "You cannot challenge yourself.",
      flags: MessageFlags.Ephemeral,
    })
    return false;
  }

  return true;
}