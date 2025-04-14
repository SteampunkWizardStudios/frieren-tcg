import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { sendInfoMessage } from "./util/sendInfoMessage";

export async function showRankingSystem(
  interaction: ChatInputCommandInteraction
) {

  const embed = new EmbedBuilder()
    .setTitle("Frieren TCG - Ranking System")
    .setDescription(
      "Ranking System. Do `/tcg-stat player` to view your personal stat, and `/tcg-stat global` for serverwide stats!"
    )
    .setColor(0xc5c3cc)
    .setTimestamp()
    .addFields(
      {
        name: "Ranked Matches and Ranked Modes",
        value: [
          `When you challenge another player while setting Ranked to True, the match will count towards your ranking.`,
          `Currently, there are 3 Ranked ladders available, for 3 different game modes:`,
          `- **Classic**: Turn Duration=45s, RevealHands=False, RevealActiveCards=False`,
          `- **Blitz**: Turn Duration=10s, RevealHands=False, RevealActiveCards=False`,
          `- **Slow**: Turn Duration=2m, RevealHands=True, RevealActiveCards=True`,
        ].join("\n"),
      },
      {
        name: "Earning Points",
        value: [
          `By default, you earn **20** points x 2^(opp's rank - your rank) for every win. Examples:`,
          `- If you win against someone from your own rank, you gain **20** points`,
          `- If you win against someone 2 ranks higher, you gain 20 x 2^2 = **80** points`,
          `- If you win against someone 2 ranks lower, you gain 20 x 2^-2 = **5** points`,
          `While you are lower than 3rd-class, you don't lose points per defeat.`,
          `Starting from 3rd-class, you lose **10** points x 2^(opp's rank - your rank) for every defeat.`,
        ].join("\n"),
      },
      {
        name: "Ranks",
        value: [
          `Each game mode has an independent rank system. The ranks are as below:`,
          `- **Apprentice Battle Mage**: 0 point`,
          `- **5th-class Battle Mage**: 100 points`,
          `- **4th-class Battle Mage**: 200 points`,
          `- **3rd-class Battle Mage**: 300 points`,
          `- **2nd-class Battle Mage**: 400 points`,
          `- **1st-class Battle Mage**: 500 points`,
        ].join("\n"),
      }
    );

  sendInfoMessage(interaction, embed, []);
}
