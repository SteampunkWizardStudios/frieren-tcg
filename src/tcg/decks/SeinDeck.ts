import Deck from "../deck";
import Card from "../card";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import { CharacterName } from "../characters/metadata/CharacterName";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_trustInYourAllyFrierensZoltraak = new Card({
  title: "Trust in Your Ally: Frieren's Zoltraak",
  description: ([dmg]) => `HP-5. DMG ${dmg} + HP/10`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Frieren!`,
        TCGThread.Gameroom,
      );
    } else {
      messageCache.push(`${character.name} used Zoltraak.`, TCGThread.Gameroom);
    }

    const damage = Number(
      (
        this.calculateEffectValue(this.effects[0]) +
        character.stats.stats.HP / 10
      ).toFixed(2),
    );
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 5 });
  },
});

export const a_trustInYourAllyFernsBarrage = new Card({
  title: "Trust in Your Ally: Fern's Barrage",
  description: ([dmg]) =>
    `HP-7. DMG ${dmg}+HP/10 DMG. Next turn, deal ${dmg}+HP/10 DMG at turn end.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Fern!`,
        TCGThread.Gameroom,
      );
    } else {
      messageCache.push(
        `${character.name} used a simple offensive spell barrage.`,
        TCGThread.Gameroom,
      );
    }

    if (character.adjustStat(-7, StatsEnum.HP)) {
      const damage = Number(
        (
          this.calculateEffectValue(this.effects[0]) +
          character.stats.stats.HP / 10
        ).toFixed(2),
      );
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 0,
      });
      character.timedEffects.push(
        new TimedEffect({
          name: "Barrage",
          description: `Deal ${damage} at the end of the effect.`,
          turnDuration: 2,
          endOfTimedEffectAction: (game, characterIndex, messageCache) => {
            messageCache.push("The barrage continues!", TCGThread.Gameroom);
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 0,
              isTimedEffectAttack: true,
            });
          },
        }),
      );
    }
  },
});

const a_trustInYourAllyStarksLightningStrike = new Card({
  title: "Trust in Your Ally: Stark's Lightning Strike",
  description: ([dmg]) => `Priority-1. HP-9. DMG ${dmg}+HP/7.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [7],
  priority: -1,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on help from Stark!`,
        TCGThread.Gameroom,
      );
    } else {
      messageCache.push(
        `${character.name} used lightning strike.`,
        TCGThread.Gameroom,
      );
    }

    const damage = Number(
      (
        this.calculateEffectValue(this.effects[0]) +
        character.stats.stats.HP / 7
      ).toFixed(2),
    );
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 9 });
  },
});

export const mugOfBeer = new Card({
  title: "Mug of Beer",
  description: ([hp, atk]) => `HP+${hp}. ATK+${atk}. DEF-2. SPD-1.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [6, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} downed a mug of beer.`,
      TCGThread.Gameroom,
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK,
    );
    character.adjustStat(-2, StatsEnum.DEF);
    character.adjustStat(-1, StatsEnum.SPD);
  },
});

export const smokeBreak = new Card({
  title: "Smoke Break",
  description: ([atk, def, spd]) => `HP-3. ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [2, 1, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} took a smoke break.`,
      TCGThread.Gameroom,
    );
    if (character.adjustStat(-3, StatsEnum.HP)) {
      character.adjustStat(
        this.calculateEffectValue(this.effects[0]),
        StatsEnum.ATK,
      );
      character.adjustStat(
        this.calculateEffectValue(this.effects[1]),
        StatsEnum.DEF,
      );
      character.adjustStat(
        this.calculateEffectValue(this.effects[2]),
        StatsEnum.SPD,
      );
    }
  },
});

const awakening = new Card({
  title: "Awakening",
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [2, 1, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(`${character.name} used Awakening!`, TCGThread.Gameroom);

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK,
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF,
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD,
    );
  },
});

export const poisonCure = new Card({
  title: "Poison Cure",
  description: ([hp]) => `HP+${hp}.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} applied a poison cure.`,
      TCGThread.Gameroom,
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
  },
});

export const braceYourself = new Card({
  title: "Brace Yourself",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SEIN_CARD,
  priority: 1,
  effects: [20],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    if (character.name === CharacterName.Sein) {
      messageCache.push(
        `${character.name} called on ${character.cosmetic.pronouns.possessive} allies to brace themselves!`,
        TCGThread.Gameroom,
      );
    } else {
      messageCache.push(
        `${character.name} braced ${character.cosmetic.pronouns.reflexive}.`,
        TCGThread.Gameroom,
      );
    }

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Brace Yourself",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const a_threeSpearsOfTheGoddess = new Card({
  title: "Three Spears of the Goddess",
  description: ([dmg]) =>
    `HP-15. At the next 3 turn ends, deal ${dmg}+HP/10 DMG.`,
  emoji: CardEmoji.SEIN_CARD,
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} used Three Spears of the Goddess!`,
      TCGThread.Gameroom,
    );
    if (character.adjustStat(-15, StatsEnum.HP)) {
      const damage = Number(
        (
          this.calculateEffectValue(this.effects[0]) +
          character.stats.stats.HP / 10
        ).toFixed(2),
      );
      character.timedEffects.push(
        new TimedEffect({
          name: "Three Spears of the Goddess",
          description: `Deal ${damage} at each turn's end.`,
          turnDuration: 3,
          endOfTurnAction: (game, characterIndex) => {
            messageCache.push(
              "The goddess' spears continue to rain!",
              TCGThread.Gameroom,
            );
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 0,
              isTimedEffectAttack: true,
            });
          },
        }),
      );
    }
  },
});

export const seinDeck = [
  { card: a_trustInYourAllyFrierensZoltraak, count: 2 },
  { card: a_trustInYourAllyStarksLightningStrike, count: 1 },
  { card: a_trustInYourAllyFernsBarrage, count: 2 },
  { card: mugOfBeer, count: 2 },
  { card: smokeBreak, count: 1 },
  { card: awakening, count: 2 },
  { card: poisonCure, count: 2 },
  { card: braceYourself, count: 1 },
  { card: a_threeSpearsOfTheGoddess, count: 2 },
];
