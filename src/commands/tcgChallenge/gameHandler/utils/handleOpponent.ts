import { ChatInputCommandInteraction, MessageFlags, User } from "discord.js";

export const handleOpponent = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null,
  ranked: boolean
): Promise<boolean> => {
  if (!opponent) {
    return true;
  }

  if (opponent.bot) {
    await interaction.editReply({
      content: "You cannot challenge a bot.",
    });
    return false;
  }

  if (ranked && opponent.id === challenger.id) {
    await interaction.editReply({
      content: "You cannot challenge yourself to a ranked match.",
    });
    return false;
  }

  return true;
};
