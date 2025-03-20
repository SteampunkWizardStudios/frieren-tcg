import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

export async function showGameAdvancedRules(
  interaction: ChatInputCommandInteraction,
) {
  const dm = interaction.options.getBoolean("dm");

  const embed = new EmbedBuilder()
    .setTitle("Frieren TCG - Advanced Rules, Formulas and Edge Cases")
    .setDescription(
      "Advanced Rules, Formulas and Edge Cases. Use `/tcp info how-to-play` instead for How to Play the game!",
    )
    .setColor(0xc5c3cc)
    .setTimestamp()
    .addFields(
      {
        name: "Empowerment",
        value: `
          There are 2 ways a card can be empowered.
- If a card is not used during the round, it receives Empower+1.
- If the result of the 4d6 lands on a duplicate card, the card receives Empower+1 per duplication.
          Empower level remains permanent until the end of the game, even after reshuffling.
        `,
      },
      {
        name: "Card Effect",
        value: `A card's effect is the **bolded** values on the card's description. These are the only values affected by Empowerment on a card.`,
      },
      {
        name: "Empowerment Effect",
        value: `Increases the **effect **of the card by (**empower level**)*10%.`,
      },
      {
        name: "Damage Calculation",
        value: "**Damage Dealt** = (Modifiers x DMG + ATK) - Opponent's DEF",
      },
      {
        name: "Interactions and Edge Cases",
        value: `
- When a move with HP cost is supposed to set your HP to less than 0, it sets your HP to 1 instead.
- For Serie's **Warmonger** ability, end of turn attacks are not counted towards the ability's effect.
- For Linie's **Chain Attack** ability, end of turn attacks from Timed Effects are counted towards the ability's effect.`,
      },
    );

  if (interaction.channel?.type === ChannelType.DM || dm) {
    await interaction.reply({
      content: `Sending DM...`,
      flags: MessageFlags.Ephemeral,
    });
    await interaction.user.send({ embeds: [embed] }).catch(async (error) => {
      console.log(error);
      await interaction.editReply({
        content: `Failed to send DM. Please check if you have DMs enabled.`,
      });
    });
    return;
  } else {
    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
