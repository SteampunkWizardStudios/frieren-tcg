import Deck from "../deck";
import Card from "../card";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const imitate = new Card({
  title: "Imitate",
  description: () =>
    `Use the card the opponent used last turn at this card's empower level -2.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);

    messageCache.push(
      `${character.name} imitates ${opponent.name}'s last move.`,
      TCGThread.Gameroom,
    );

    const lastCard =
      game.additionalMetadata.lastUsedCards?.[1 - characterIndex];
    if (lastCard) {
      const newCard = new Card({
        ...lastCard,
        empowerLevel: this.empowerLevel - 2,
      });

      messageCache.push(
        `${character.name} uses ${newCard.getTitle()}`,
        TCGThread.Gameroom,
      );
      newCard.cardAction(game, characterIndex, messageCache);
    } else {
      messageCache.push(
        "There was no move to imitate. The move failed!",
        TCGThread.Gameroom,
      );
    }
  },
});

export const adapt = new Card({
  title: "Adapt",
  description: ([spd, atkDef, hp]) =>
    `SPD+${spd}. If HP > 50, ATK+${atkDef}, DEF+${atkDef}. If HP <= 50, heal ${hp} HP.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 3, 12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} adapts to the situation.`,
      TCGThread.Gameroom,
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD,
    );

    const atkDefAdjust = this.calculateEffectValue(this.effects[1]);
    if (character.stats.stats.HP > 50) {
      character.adjustStat(atkDefAdjust, StatsEnum.ATK);
      character.adjustStat(atkDefAdjust, StatsEnum.DEF);
    } else {
      character.adjustStat(
        this.calculateEffectValue(this.effects[2]),
        StatsEnum.HP,
      );
    }
  },
});

export const manaDetection = new Card({
  title: "Mana Detection",
  description: ([spd, bigNumber, smallNumber]) =>
    `SPD+${spd}. If Opp's DEF >= Opp's ATK, ATK+${bigNumber}, DEF+${smallNumber}. Otherwise, ATK+${smallNumber}, DEF+${bigNumber}.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 2, 1],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} detects the opponent's mana flow.`,
      TCGThread.Gameroom,
    );

    const opponent = game.getCharacter(1 - characterIndex);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD,
    );

    const bigNumber = this.calculateEffectValue(this.effects[1]);
    const smallNumber = this.calculateEffectValue(this.effects[2]);

    if (opponent.stats.stats.DEF >= opponent.stats.stats.ATK) {
      character.adjustStat(bigNumber, StatsEnum.ATK);
      character.adjustStat(smallNumber, StatsEnum.DEF);
    } else {
      character.adjustStat(smallNumber, StatsEnum.ATK);
      character.adjustStat(bigNumber, StatsEnum.DEF);
    }
  },
});

const parry = new Card({
  title: "Parry",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [20],
  priority: 1,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to parry the opponent's attack.`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(-def, StatsEnum.DEF);
        },
      }),
    );
  },
});

export const a_erfassenAxe = new Card({
  title: "Erfassen: Axe",
  description: ([dmg]) => `HP-3. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [11],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Axe imitation.`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 3 });
  },
});

export const a_erfassenSword = new Card({
  title: "Erfassen: Sword",
  description: ([dmg]) => `HP-2. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [9],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Sword imitation.`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 2 });
  },
});

export const a_erfassenSpear = new Card({
  title: "Erfassen: Spear",
  description: ([dmg]) => `HP-1. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Spear imitation.`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 1 });
  },
});

export const a_erfassenKnife = new Card({
  title: "Erfassen: Knife",
  description: ([dmg]) => `DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Knife throw imitation.`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 0 });
  },
});

export const linieDeck = [
  { card: imitate, count: 2 },
  { card: adapt, count: 2 },
  { card: manaDetection, count: 2 },
  { card: parry, count: 1 },
  { card: a_erfassenAxe, count: 2 },
  { card: a_erfassenSword, count: 2 },
  { card: a_erfassenSpear, count: 2 },
  { card: a_erfassenKnife, count: 2 },
];
