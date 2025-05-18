import { formatAbility } from "@src/tcg/ability";
import Character from "@tcg/character";
import { statDetails } from "@tcg/formatting/emojis";
import { ProgressBarBuilder } from "@tcg/formatting/percentBar";
import { StatsEnum } from "@tcg/stats";

export const printCharacter = (
  character: Character,
  obfuscateInformation: boolean
): string => {
  const meta = character.additionalMetadata;

  const printStack: string[] = [];
  const charStat = character.stats.stats;
  let hpInfo: string;
  if (meta.manaSuppressed && obfuscateInformation) {
    hpInfo = "?? / ??";
  } else {
    const healthbar = new ProgressBarBuilder()
      .setValue(charStat.HP)
      .setMaxValue(character.initialStats.stats.HP)
      .setLength(10)
      .build();
    hpInfo = `${charStat.HP}/${character.initialStats.stats.HP} ${healthbar.barString}`;
  }
  const activePileCount = character.deck.activePile.length;
  const discardPileCount = character.deck.discardPile.length;
  const lines = [
    `# ${character.name} (${character.characterUser.displayName}) [⠀](${character.cosmetic.imageUrl})`,
    `- ${statDetails[StatsEnum.HP].emoji} **HP**: ${hpInfo}`,
    `- ${statDetails[StatsEnum.ATK].emoji} **ATK**: ${charStat.ATK}`,
    `- ${statDetails[StatsEnum.DEF].emoji} **DEF**: ${charStat.DEF}`,
    `- ${statDetails[StatsEnum.SPD].emoji} **SPD**: ${charStat.SPD}`,
    `- ${statDetails[StatsEnum.Ability].emoji} **Ability**: ${character.ability.abilityName} - ${charStat.Ability}`,
    `  - ${formatAbility(character.ability)}`,
    `**Active Pile:** ${activePileCount} Card${activePileCount > 1 ? "s" : ""}     **Discard Pile:** ${discardPileCount} Card${discardPileCount > 1 ? "s" : ""}`,
  ];
  printStack.push(lines.join("\n"));

  const statuses: string[] = [];
  if (meta.sleepyCount > 0) {
    statuses.push(`**Sleepy**: ${meta.sleepyCount}`);
  }
  if (meta.mesmerizedCount > 0) {
    statuses.push(`**Mesmerized**: ${meta.mesmerizedCount}`);
  }
  if (meta.weakenedCount > 0) {
    statuses.push(`**Weakened**: ${meta.weakenedCount}`);
  }
  if (statuses.length > 0) {
    printStack.push(statuses.join(", "));
  }

  if (meta.manaSuppressed) {
    printStack.push(
      `**Mana Suppression**: ${character.name} suppresses ${character.cosmetic.pronouns.possessive} mana - ${character.cosmetic.pronouns.possessive} HP is hidden.`
    );
  }
  if (meta.senseTeaTimeStacks) {
    printStack.push(`**Tea Time Snacks**: ${meta.senseTeaTimeStacks}`);
  }
  if (meta.fernBarrage && meta.fernBarrage > 0) {
    printStack.push(`**Barrage**: ${meta.fernBarrage}`);
  }
  if (meta.forcedDiscards > 0) {
    printStack.push(`**Forced Discards**: ${meta.forcedDiscards}`);
  }
  if (character.timedEffects.length > 0) {
    printStack.push(`**Timed effects:**`);
    character.timedEffects.forEach((effect) => {
      printStack.push(effect.printEffect());
    });
  }
  return printStack.join("\n");
};
