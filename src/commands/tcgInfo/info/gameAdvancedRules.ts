import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { statDetails } from "../../../tcg/formatting/emojis";
import { sendInfoMessage } from "./util/sendInfoMessage";
import {
  serie_offensiveMagic,
  serie_utilityMagic,
} from "../../../tcg/decks/utilDecks/serieMagic";
import Card from "../../../tcg/card";

export enum AdvancedRulesSection {
  EmpowermentAndEffectCalculation = "Empowerment and Effect Calculation",
  InteractionsAndEdgeCases = "Interactions and Edge Cases",
  SeriesPoolOffense = "Serie's Living Grimoire: Offense Chapter's Card Pool",
  SeriesPoolUtility = "Serie's Living Grimoire: Utility Chapter's Card Pool",
}

const sectionToFields: Record<
  AdvancedRulesSection,
  { name: string; value: string }[]
> = {
  [AdvancedRulesSection.EmpowermentAndEffectCalculation]: [
    {
      name: "Empowerment",
      value: [
        `There are 2 ways a card can be empowered.`,
        `- If a card is not used during the round, it receives Empower+1.`,
        `- If the result of the 4d6 lands on a duplicate card, the card receives Empower+1 per duplication.`,
        `Empower level remains permanent until the end of the game, even after reshuffling.`,
      ].join("\n"),
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
      value: `**Damage Dealt** = (Modifiers x DMG + ${statDetails.ATK.emoji} ATK) - Opponent's ${statDetails.DEF.emoji} DEF`,
    },
  ],
  [AdvancedRulesSection.InteractionsAndEdgeCases]: [
    {
      name: "Turn Limit",
      value: `When the game reaches **Turn 50**, the game ends in a draw.`,
    },
    {
      name: "Interactions and Edge Cases",
      value: [
        `- When a move with ${statDetails.HP.emoji} HP cost is supposed to set your HP to less than 0, it sets your ${statDetails.HP.emoji} HP to 1 instead.`,
        `- For Serie's **Toying Around** ability, end of turn attacks **are counted** towards the ability's effect.`,
        `- For Linie's **Chain Attack** ability, end of turn attacks from Timed Effects are counted towards the ability's effect.`,
      ].join("\n"),
    },
  ],
  [AdvancedRulesSection.SeriesPoolOffense]: [
    {
      name: `Living Grimoire: Offense Chapter - Available Draw Pool:`,
      value: "",
    },
    ...serie_offensiveMagic.map((card: Card) => {
      return {
        name: `${card.emoji} **${card.title}**:`,
        value: `${card.getDescription()}`,
      };
    }),
  ],
  [AdvancedRulesSection.SeriesPoolUtility]: [
    {
      name: `Living Grimoire: Utility Chapter - Available Draw Pool:`,
      value: "",
    },
    ...serie_utilityMagic.map((card: Card) => {
      return {
        name: `${card.emoji} **${card.title}**:`,
        value: `${card.getDescription()}`,
      };
    }),
  ],
};

export async function showGameAdvancedRules(
  interaction: ChatInputCommandInteraction
) {
  const dm = interaction.options.getBoolean("dm") ? true : false;
  const section =
    (interaction.options.getString("section") as AdvancedRulesSection) ??
    AdvancedRulesSection.EmpowermentAndEffectCalculation;

  const embed = new EmbedBuilder()
    .setTitle("Frieren TCG - Advanced Rules, Formulas and Edge Cases")
    .setDescription(
      "Advanced Rules, Formulas and Edge Cases. Use `/tcp info how-to-play` instead for How to Play the game!"
    )
    .setColor(0xc5c3cc)
    .setTimestamp()
    .addFields(...sectionToFields[section]);
  sendInfoMessage(interaction, embed, [], dm);
}
