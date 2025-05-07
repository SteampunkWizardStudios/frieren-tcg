import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { statDetails } from "@tcg/formatting/emojis";
import { sendInfoMessage } from "./util/sendInfoMessage";
import {
  serie_offensiveMagic_common,
  serie_offensiveMagic_rare,
  serie_offensiveMagic_unusual,
  serie_utilityMagic_recovery,
  serie_utilityMagic_tactics,
} from "@decks/utilDecks/serieMagic";
import { SIGNATURE_MOVES_LIST } from "@decks/utilDecks/signatureMoves";
import Card from "@tcg/card";
import { characterNameToEmoji } from "@tcg/formatting/emojis";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";

export enum AdvancedRulesSection {
  EmpowermentAndEffectCalculation = "Empowerment and Effect Calculation",
  InteractionsAndEdgeCases = "Interactions and Edge Cases",
  SeriesPoolOffense = "Serie's Living Grimoire: Offense Chapter's Card Pool",
  SeriesPoolUtility = "Serie's Living Grimoire: Utility Chapter's Card Pool",
  SignatureMoves = "Character signature moves: Übel's Empathy Card Pool",
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
      value: `Increases the **effect** of the card by (**empower level**)*10%.`,
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
    {
      name: "3rd Class Magic Section",
      value: serie_offensiveMagic_common
        .slice(0, 7)
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
    {
      name: "",
      value: serie_offensiveMagic_common
        .slice(7, serie_offensiveMagic_common.length)
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
    {
      name: "1st Class Magic Section",
      value: serie_offensiveMagic_rare
        .slice(0, 7)
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
    {
      name: "",
      value: serie_offensiveMagic_rare
        .slice(7, serie_offensiveMagic_rare.length)
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
    {
      name: "Great Mage's Magic Section",
      value: serie_offensiveMagic_unusual
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
  ],
  [AdvancedRulesSection.SeriesPoolUtility]: [
    {
      name: `Living Grimoire: Utility Chapter - Available Draw Pool:`,
      value: "",
    },
    {
      name: "Tactics Section",
      value: serie_utilityMagic_tactics
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
    {
      name: "Recovery Section",
      value: serie_utilityMagic_recovery
        .map((card: Card) => `${card.emoji} **${card.title}**`)
        .join("\n"),
    },
  ],
  [AdvancedRulesSection.SignatureMoves]: [
    {
      name: `Empathy: signature moves.`,
      value: "",
    },
    {
      name: "",
      value: SIGNATURE_MOVES_LIST.slice(0, 7)
        .map(
          (nameCardPair) =>
            `${characterNameToEmoji[nameCardPair[0] as CharacterName]} **${nameCardPair[0]}**: ${nameCardPair[1].title}.`
        )
        .join("\n"),
    },
    {
      name: "",
      value: SIGNATURE_MOVES_LIST.slice(7, SIGNATURE_MOVES_LIST.length)
        .map(
          (nameCardPair) =>
            `${characterNameToEmoji[nameCardPair[0] as CharacterName]} **${nameCardPair[0]}**: ${nameCardPair[1].title}.`
        )
        .join("\n"),
    },
  ],
};

export async function showGameAdvancedRules(
  interaction: ChatInputCommandInteraction
) {
  const section =
    (interaction.options.getString("section") as AdvancedRulesSection) ??
    AdvancedRulesSection.EmpowermentAndEffectCalculation;

  const embed = new EmbedBuilder()
    .setTitle("Frieren TCG - Advanced Rules, Formulas and Edge Cases")
    .setDescription(
      "Advanced Rules, Formulas and Edge Cases. Use `/tcg info how-to-play` instead for How to Play the game!"
    )
    .setColor(0xc5c3cc)
    .setTimestamp()
    .addFields(...sectionToFields[section]);
  sendInfoMessage(interaction, embed, []);
}
