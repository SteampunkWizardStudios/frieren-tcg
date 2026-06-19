import { ChatInputCommandInteraction, ContainerBuilder } from "discord.js";
import { statDetails } from "@tcg/formatting/emojis";
import { sendInfoContainer } from "./util/sendInfoMessage";

const statsContinued = [
  "## Stats (continued)",
  "### True Defense",
  `Some attacks have a piercing effect, which ignores a percentage of the target's defense. If you use a move with 30% Piercing on a target with 10 ${statDetails.DEF.emoji} DEF, it would ignore 3 ${statDetails.DEF.emoji} DEF, dealing 3 extra damage.`,
  `${statDetails.TrueDEF.emoji} True Defense works the same as regular defense but it is not affected by piercing.`,
  `Most characters have two copies of a *blocking card* which gives 20 ${statDetails.TrueDEF.emoji} TrueDEF for that turn.`,
  "### Floors",
  `${statDetails.ATK.emoji} ATK, ${statDetails.DEF.emoji} DEF and ${statDetails.SPD.emoji} SPD cannot be reduced to less than 1.`,
  "### HP Costs",
  `Many cards, typically attacks, have an ${statDetails.HP.emoji} HP Cost. If you have less ${statDetails.HP.emoji} HP than the cost, your ${statDetails.HP.emoji} HP drops to 1 instead of 0.`,
  "### Minimum Damage",
  `Without modifiers, attacks deal a minimum of 1 damage, regardless of ${statDetails.DEF.emoji} DEF or ${statDetails.TrueDEF.emoji} TrueDEF.`,
  "### Damage Modifiers",
  `Some abilities, like Linie's Chain or Stark's Bravest Coward ability describe a percentage increase to attacks, these modifiers are applied before ${statDetails.ATK.emoji} ATK is added.`,
  "### Priority",
  `Some moves have priority, and some abilities can also change priority. The card with higher priority goes first, and within the same priority, ${statDetails.SPD.emoji} SPD determines the order again.`,
];
const timedEffects = [
  "## Timed Effects",
  "Timed effects are created by moves when they have a temporary effect lasting for a certain number of turns. You can see all the timed effects of yourself and your opponent and how long they last.",
];
const draws = [
  "## Draws",
  "Drawing in Frieren TCG is rare, but occurs when both players forfeit on the same turn or when the turn limit of 50 is reached. Most games last 15 turns.",
];
const rankedPlay = [
  "## Ranked Games",
  "To play a ranked match, run `/tcg-challenge ranked`. The only gameplay difference is character bans, which you select *before* you select a character.",
  "Learn more about the ranked system with `/tcg-info ranking-system`.",
];
const sections = [statsContinued, timedEffects, draws, rankedPlay];

const container = new ContainerBuilder()
  .setAccentColor(0xc5c3cc)
  .addTextDisplayComponents((t) => t.setContent("# Frieren TCG - Extra Guide"));
for (const section of sections) {
  container.addTextDisplayComponents((t) => t.setContent(section.join("\n")));
}

export async function showGameExtraGuide(
  interaction: ChatInputCommandInteraction
) {
  sendInfoContainer(interaction, container);
}
