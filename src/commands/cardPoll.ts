import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "@src/types/command";
import { CardEmoji } from "@tcg/formatting/emojis";

const TRUE_DURATION = 1.5 * 60 * 1000;

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("card-poll")
    .setDescription("Poll")
    .addStringOption((option) =>
      option
        .setName("cards")
        .setDescription("The card names to vote on")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const cardInput = interaction.options.getString("cards", true);
    const cards = parseCardInput(cardInput);

    const interactionResponse = await interaction.reply({
		content: `Turn ends <t:${Math.floor((Date.now() + TRUE_DURATION) / 1000)}:R>`,
      poll: {
        question: { text: "Which card do you want your team to play?" },
        answers: cards.map((card) => ({
          emoji: card.emoji,
          text: card.name,
        })),
        duration: 1,
        allowMultiselect: false,
      },
      withResponse: true,
    });

    setTimeout(async () => {
      await interactionResponse.resource?.message?.poll?.end();
    }, TRUE_DURATION);
  },
};
function parseCardInput(input: string) {
  return input
    .split(",")
    .map((entry) => entry.trim())
    .map((entry) => {
      const [emojiPart, namePart] = entry.split(":").map((s) => s.trim());

      return {
        name: namePart,
        emoji: emojiPart ?? CardEmoji.GENERIC,
      };
    })
    .filter((card) => card.name.length > 0);
}
