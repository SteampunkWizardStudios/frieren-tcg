import Deck from "../deck";
import Card from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_zoltraak = new Card({
  title: "Offensive Magic Analysis: Zoltraak",
  description: ([dmg]) =>
    `HP-4. DMG ${dmg}. 1 Analysis stack will be gained after attack.`,
  emoji: CardEmoji.FRIEREN_CARD,
  tags: { PostAnalysis: 1 },
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} fired Zoltraak!`, TCGThread.Gameroom);

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, {damage, hpCost: 5});
  },
});

export const fieldOfFlower = new Card({
  title: "Spell to make a Field of Flowers",
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
  emoji: CardEmoji.FLOWER_FIELD,
  effects: [5, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conjured a field of flowers!`,
      TCGThread.Gameroom,
    );

    character.adjustStat(5, StatsEnum.HP);
    const endOfTurnHealing = this.calculateEffectValue(this.effects[1]);
    character.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 3,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Field of Flowers soothes ${character.name}.`,
            TCGThread.Gameroom,
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP,
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Field of Flowers fades.", TCGThread.Gameroom);
        },
      }),
    );
  },
});

export const a_judradjim = new Card({
  title: "Destructive Lightning: Judradjim",
  description: ([dmg]) => `HP-7. DMG ${dmg}`,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} sent forth Judradjim!`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, {damage, hpCost: 7});
  },
});

export const a_vollzanbel = new Card({
  title: "Hellfire Summoning: Vollzanbel",
  description: ([dmg]) => `HP-10. DMG ${dmg}`,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [15],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} summoned Vollzanbel!`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, {damage, hpCost: 10});
  },
});

const barrierMagicAnalysis = new Card({
  title: "Barrier Magic Analysis",
  description: ([atk, spd, def]) =>
    `ATK+${atk}. SPD+${spd}. Opponent's DEF-${def}`,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [2, 1, 1],
  tags: { Analysis: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} analyzed the opponent's defense!`,
      TCGThread.Gameroom,
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK,
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD,
    );
    game.characters[1 - characterIndex].adjustStat(
      -1 * this.calculateEffectValue(this.effects[2]),
      StatsEnum.DEF,
    );
  },
});

const demonMagicAnalysis = new Card({
  title: "Demon Magic Analysis",
  description: ([atk, spd, def]) => `ATK+${atk}. SPD+${spd}. DEF+${def}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [2, 2, 1],
  tags: { Analysis: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} analyzed ancient demon's magic!`,
      TCGThread.Gameroom,
    );

    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK,
    );
    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD,
    );
    game.characters[characterIndex].adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.DEF,
    );
  },
});

const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [20],
  priority: 1,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} cast ordinary defensive magic!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const a_theHeightOfMagic = new Card({
  title: `"The Height of Magic"`,
  description: ([dmg]) =>
    `HP-50. At this turn's resolution, strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20. `,
  emoji: CardEmoji.FRIEREN_CARD,
  effects: [40],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} used "The Height of Magic"`,
      TCGThread.Gameroom,
    );
    const endOfTurnDamage = this.calculateEffectValue(this.effects[0]);
    if (character.adjustStat(-1 * 50, StatsEnum.HP)) {
      character.timedEffects.push(
        new TimedEffect({
          name: "Impending: Height of Magic",
          description: `At this turn's resolution, strike for ${endOfTurnDamage}. Afterwards, DEF-20, SPD-20.`,
          turnDuration: 1,
          endOfTimedEffectAction: (game, characterIndex) => {
            messageCache.push(
              "The Height of Magic is on display.",
              TCGThread.Gameroom,
            );
            game.attack({
              attackerIndex: characterIndex,
              damage: endOfTurnDamage,
              isTimedEffectAttack: true,
            });
            character.adjustStat(-20, StatsEnum.DEF);
            character.adjustStat(-20, StatsEnum.SPD);
          },
        }),
      );
    }
  },
});

export const frierenDeck = [
  { card: a_zoltraak, count: 2 },
  { card: a_judradjim, count: 2 },
  { card: a_vollzanbel, count: 2 },
  { card: barrierMagicAnalysis, count: 3 },
  { card: demonMagicAnalysis, count: 2 },
  { card: ordinaryDefensiveMagic, count: 1 },
  { card: fieldOfFlower, count: 2 },
  { card: a_theHeightOfMagic, count: 1 },
];
