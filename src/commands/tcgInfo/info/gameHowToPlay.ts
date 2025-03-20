import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { statDetails } from "../../../tcg/formatting/emojis";
import { sendInfoMessage } from "./util/sendInfoMessage";

export async function showGameHowToPlay(
  interaction: ChatInputCommandInteraction,
) {
  const isDetailed = interaction.options.getBoolean("detailed");
  const dm = interaction.options.getBoolean("dm") ? true : false;

  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTimestamp()
    .setFooter({ text: "Have fun!" });

  if (!isDetailed) {
    embed.setTitle("Frieren TCG - How to Play").addFields({
      name: "How To Play",
      value: [
        `- Every turn, you are given **a list of moves** to use.`,
        `- Whoever has the **higher ${statDetails.SPD.emoji} SPD** will move **first**.`,
        `- You **win** when **your opponent's ${statDetails.HP.emoji} HP drops to 0**!`,
      ].join("\n"),
    });
  } else {
    embed.setTitle("Frieren TCG - Detailed Ruleset").addFields(
      {
        name: "Character and Stats",
        value: [
          `- ${statDetails.HP.emoji} **HP**: Health Points - If this **becomes 0 or less than 0**, the character **loses**.`,
          `A character's **own move**, unless specified, **cannot** bring the user's ${statDetails.HP.emoji} HP to **less than 1**.`,
          `This means that the only way for your ${statDetails.HP.emoji} HP to drop to 0 is if it's **at the effect of your opponent's move**.`,
          `- ${statDetails.ATK.emoji} **ATK**: Attack`,
          `- ${statDetails.DEF.emoji} **DEF**: Defense`,
          `- ${statDetails.SPD.emoji} **SPD**: Speed - determines who moves first`,
        ].join("\n"),
      },
      {
        name: "Gameplay",
        value: [
          `Every turn:`,
          `- Both characters **draw 6 cards** from their deck and **roll 4d6**.`,
          `    - The results of the 4d6 determines **which of the 6 cards** the character can use that turn.`,
          `    - If there is **a repeat**, the card is **Empowered**, increasing its effect.`,
          `- Players then choose 1 card to use.`,
          `    - Players can also choose to either **Discard** all cards they can use that turn and draw the same number of cards discarded, or **Wait** and heal 10 HP.`,
          `- After the card is used, it is **saved in a discard pile**. Draw a new card.`,
          `    - Every cards that **were not used** that turn is **Empowered**, increasing their effects.`,
          `    - If there is no longer a new card to draw, **shuffle the discard pile** and start drawing from there.`,
          `- The game **ends** when **one of the player's ${statDetails.HP.emoji} HP reaches 0.**`,
        ].join("\n"),
      },
    );
  }

  sendInfoMessage(interaction, embed, [], dm);
}
