import Deck from "../deck";
import Card from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";

export const a_hairWhip = new Card({
  title: "Hair Whip",
  description: ([def, dmg]) =>
    `DEF+${def}. Afterwards, HP-3, DMG ${dmg}+DEF/4.`,
  effects: [2, 5],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    console.log(
      `${character.name} whipped ${character.cosmetic.pronouns.possessive} hair!`,
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    const newDef = character.stats.stats.DEF + defIncrease;
    character.adjustStat(defIncrease, StatsEnum.DEF);
    const damage = this.calculateEffectValue(this.effects[1]) + newDef / 4;

    CommonCardAction.commonAttack(game, characterIndex, damage, 3, false);
  },
});

const harden = new Card({
  title: "Harden",
  description: ([def]) => `HP-2. DEF+${def}`,
  effects: [2],
  emoji: CardEmoji.SHIELD,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    console.log(
      `${character.name} toughened ${character.cosmetic.pronouns.possessive} hair defense!`,
    );

    if (character.adjustStat(-2, StatsEnum.HP)) {
      character.adjustStat(
        this.calculateEffectValue(this.effects[0]),
        StatsEnum.DEF,
      );
    }
  },
});

const holeUp = new Card({
  title: "Hole Up",
  description: ([def]) =>
    `Discard 1 card at random and draw 1 card. SPD-2. DEF+${def}`,
  effects: [2],
  emoji: CardEmoji.DICE,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    console.log(
      `${character.name} holed ${character.cosmetic.pronouns.reflexive} up!`,
    );

    character.discardCard(Rolls.rollDAny(5));
    character.drawCard();
    character.adjustStat(-2, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF,
    );
  },
});

const rest = new Card({
  title: "Rest",
  description: ([hp]) => `DEF-2. Heal ${hp} HP`,
  effects: [10],
  emoji: CardEmoji.HEART,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    console.log(`${character.name} rests up.`);

    character.adjustStat(-1, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
  },
});

export const a_pierce = new Card({
  title: "Pierce",
  description: ([dmg]) =>
    `HP-7. DMG ${dmg} + (DEF/3). Pierces through 1/5 of the opponent's defense.`,
  effects: [10],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    console.log(`${character.name} pierced the opponent!`);

    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.DEF / 3 +
      opponent.stats.stats.DEF / 5;
    CommonCardAction.commonAttack(game, characterIndex, damage, 7, false);
  },
});

const hairBarrier = new Card({
  title: "Hair Barrier",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  effects: [20],
  emoji: CardEmoji.HOURGLASS,
  priority: 1,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    console.log(
      `${character.name} surrounded ${character.cosmetic.pronouns.reflexive} in ${character.cosmetic.pronouns.possessive} hair barrier!`,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Hair Barrier",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-1 * def, StatsEnum.DEF);
        },
      }),
    );
  },
});

const teaTime = new Card({
  title: "Tea Time",
  description: ([def, hp]) =>
    `DEF+${def} for both characters. Heal ${hp} for both characters. Gain 1 Tea Time snack.`,
  effects: [2, 8],
  tags: { TeaTime: 1 },
  emoji: CardEmoji.HEART,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    console.log(`${character.name} enjoyed a cup of tea.`);

    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);
    opponent.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

const teaParty = new Card({
  title: "Tea Party",
  description: ([def, hp]) =>
    `DEF+${def} for both characters. Heal ${hp} for both characters. Gain 2 Tea Time snacks.`,
  effects: [3, 12],
  tags: { TeaTime: 2 },
  emoji: CardEmoji.RANDOM,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    console.log(`${character.name} held a tea party!`);

    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);
    opponent.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

export const a_piercingDrill = new Card({
  title: "Piercing Drill",
  description: ([dmg]) =>
    `HP-14. DMG ${dmg} + DEF/3. Pierces through half of the opponent's defense.`,
  effects: [15],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    console.log(`${character.name} used a piercing drill!`);

    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.DEF / 3 +
      opponent.stats.stats.DEF / 2;
    CommonCardAction.commonAttack(game, characterIndex, damage, 14, false);
  },
});

export const senseDeck = [
  { card: a_hairWhip, count: 2 },
  { card: harden, count: 2 },
  { card: holeUp, count: 2 },
  { card: rest, count: 1 },
  { card: a_pierce, count: 2 },
  { card: hairBarrier, count: 1 },
  { card: teaTime, count: 2 },
  { card: teaParty, count: 1 },
  { card: a_piercingDrill, count: 2 },
];
