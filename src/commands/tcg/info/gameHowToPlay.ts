import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

export async function showGameHowToPlay(
  interaction: ChatInputCommandInteraction,
) {
  const isDetailed = interaction.options.getBoolean("detailed");

  const embed = new EmbedBuilder()
    .setColor(0xc5c3cc)
    .setTimestamp()
    .setFooter({ text: "Have fun!" });

  if (!isDetailed) {
    embed.setTitle("Frieren TCG - How to Play").addFields({
      name: "How To Play",
      value: `
- Every turn, you are given **a list of moves** to use.
- Whoever has the **higher SPD** will move **first**.
- You **win** when **your opponent's SP drops to 0**!`,
    });
  } else {
    embed.setTitle("Frieren TCG - Detailed Ruleset").addFields(
      {
        name: "Character and Stats",
        value: `
        - **SP**: Stamina Points - If this **becomes 0 or less than 0**, the character **loses**. 
        A character's **own move**, unless specified, **cannot** bring the user's SP to **less than 1**.
        This means that the only way for your SP to drop to 0 is if it's **at the effect of your opponent's move**.
- **ATK**: Attack
- **DEF**: Defense
- **SPD**: Speed - determines who moves first`,
      },
      {
        name: "Gameplay",
        value: `
        Every turn:
- Both characters **draw 6 cards** from their deck and **roll 4d6**.    
    - The results of the 4d6 determines **which of the 6 cards** the character can use that turn.
    - If there is **a repeat**, the card is **Empowered**, increasing its effect.
    - Players then choose 1 card to use.
    - Players can also choose to either **Discard** all cards they can use that turn and draw the same number of cards discarded, or **Wait** and heal 10 HP.
- After the card is used, it is **saved in a discard pile**. Draw a new card.
   - Every cards that **were not used** that turn is **Empowered**, increasing their effects.
   - If there is no longer a new card to draw, **shuffle the discard pile** and start drawing from there.
- The game **ends** when **one of the player's SP reaches 0.**`,
      },
    );
  }

  await interaction.reply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral,
  });
}
