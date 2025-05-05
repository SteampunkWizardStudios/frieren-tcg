import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { GameMessageContext } from "@tcg/gameContextProvider";

export const imitate = new Card({
  title: "Imitate",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: () =>
    `Use the card the opponent used last turn at this card's empower level -2.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const lastCard =
      game.additionalMetadata.lastUsedCards?.[1 - characterIndex];
    if (lastCard) {
      return new Card({
        ...lastCard,
        empowerLevel: this.empowerLevel - 2,
        imitated: true,
      });
    } else {
      return new Card({
        title: "Empty Imitation",
        cardMetadata: { nature: Nature.Default },
        description: () => "No card to imitate. This move will fail.",
        effects: [],
        emoji: CardEmoji.LINIE_CARD,
        cardAction: ({ messageCache }) => {
          messageCache.push(
            `No card to imitate. The move failed!`,
            TCGThread.Gameroom
          );
        },
        imitated: true,
      });
    }
  },
});

export const adapt = new Card({
  title: "Adapt",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, atkDef, hp]) =>
    `SPD+${spd}. If HP > 50, ATK+${atkDef}, DEF+${atkDef}. If HP <= 50, heal ${hp} HP.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2, 2, 10],
  cosmetic: {
    cardGif: "https://c.tenor.com/Dcc6-Rvkts8AAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} adapts to the situation.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );

    const atkDefAdjust = this.calculateEffectValue(this.effects[1]);
    if (character.stats.stats.HP > 50) {
      character.adjustStat(atkDefAdjust, StatsEnum.ATK);
      character.adjustStat(atkDefAdjust, StatsEnum.DEF);
    } else {
      character.adjustStat(
        this.calculateEffectValue(this.effects[2]),
        StatsEnum.HP
      );
    }
  },
});

export const manaDetectionBaseCardAction = function (
  this: Card,
  context: GameMessageContext
) {
  const { game, selfIndex: characterIndex, messageCache } = context;
  const character = game.getCharacter(characterIndex);
  messageCache.push(
    `${character.name} detects the opponent's mana flow.`,
    TCGThread.Gameroom
  );

  const opponent = game.getCharacter(1 - characterIndex);
  character.adjustStat(
    this.calculateEffectValue(this.effects[0]),
    StatsEnum.SPD
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

  // reveal empower
  const currentHighestEmpoweredCard = opponent.hand.reduce(
    (highest, card) =>
      card.empowerLevel > highest.empowerLevel ? card : highest,
    opponent.hand[0]
  );
  messageCache.push(
    `### ${opponent.name} is concentrating ${opponent.cosmetic.pronouns.possessive} power on the move **${currentHighestEmpoweredCard.getTitle()}**!`,
    TCGThread.Gameroom
  );
};

export const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, bigNumber, smallNumber]) =>
    `SPD+${spd}. If Opp's DEF >= Opp's ATK, ATK+${bigNumber}, DEF+${smallNumber}. Otherwise, ATK+${smallNumber}, DEF+${bigNumber}. Reveal the opponent's highest empowered card.`,
  emoji: CardEmoji.MANA_CARD,
  effects: [2, 2, 1],
  cardAction: manaDetectionBaseCardAction,
});

const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to parry the opponent's attack.`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_erfassenAxe = new Card({
  title: "Erfassen: Axe",
  description: ([dmg]) => `HP-4. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  cardMetadata: { nature: Nature.Attack },
  effects: [12],
  cosmetic: {
    cardGif: "https://c.tenor.com/eUCHN11H4B4AAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Axe imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });
  },
});

export const a_erfassenJavelin = new Card({
  title: "Erfassen: Javelin",
  description: ([dmg]) =>
    `HP-3. DMG ${dmg}. Deal ${dmg} at the end of next turn.`,
  emoji: CardEmoji.LINIE_CARD,
  cardMetadata: { nature: Nature.Attack },
  effects: [5],
  cosmetic: {
    cardGif: "https://c.tenor.com/zd9mOGFjT3IAAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Javelin imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 3 });

    character.timedEffects.push(
      new TimedEffect({
        name: "Erfassen: Javelin",
        description: `Deal ${damage} at the end of the effect.`,
        turnDuration: 2,
        activateEndOfTurnActionThisTurn: false,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} launches a javelin!`,
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

export const a_erfassenSword = new Card({
  title: "Erfassen: Sword",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `HP-2. DMG ${dmg}`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [8],
  cosmetic: {
    cardGif: "https://c.tenor.com/f4-8FBCgXg4AAAAd/tenor.gif",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Sword imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 2 });
  },
});

export const a_erfassenKnife = new Card({
  title: "Erfassen: Knife",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-1. DMG ${dmg}. At the end of the next 2 turns, deal ${dmg}.`,
  emoji: CardEmoji.LINIE_CARD,
  effects: [2],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} recalls ${character.cosmetic.pronouns.possessive} Knife throw imitation.`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 1 });

    character.timedEffects.push(
      new TimedEffect({
        name: "Erfassen: Knife",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 3,
        activateEndOfTurnActionThisTurn: false,
        endOfTurnAction: function (this: TimedEffect, game, characterIndex) {
          messageCache.push(
            `${character.name} flings a knife at the opponent!`,
            TCGThread.Gameroom
          );
          CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

const linieDeck = [
  { card: imitate, count: 2 },
  { card: adapt, count: 2 },
  { card: manaDetection, count: 2 },
  { card: parry, count: 2 },
  { card: a_erfassenAxe, count: 2 },
  { card: a_erfassenJavelin, count: 2 },
  { card: a_erfassenSword, count: 2 },
  { card: a_erfassenKnife, count: 2 },
];

export default linieDeck;