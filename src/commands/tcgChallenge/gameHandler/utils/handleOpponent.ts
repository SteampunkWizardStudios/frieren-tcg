import { ChatInputCommandInteraction, User } from "discord.js";

export const handleOpponent = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null
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

  if (opponent.id === challenger.id) {
    await interaction.editReply({
      content: "You cannot challenge yourself.",
    });
    return false;
  }

  return true;
};
