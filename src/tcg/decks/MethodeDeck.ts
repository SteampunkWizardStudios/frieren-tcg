import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";

export const a_scatterShot = new Card({
  title: "Scatter Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of next turn`,
  effects: [4],
  hpCost: 6,
  cardAction: ({
    self,
    name,
    opponent,
    calcEffect,
    basicAttack,
    sendToGameroom,
  }) => {
    sendToGameroom(`${name} fires a scatter shot!`);
    basicAttack(0);
    const dmg = calcEffect(0);
    self.timedEffects.push(
      new TimedEffect({
        name: "Scatter Shot",
        description: `Deal ${dmg} x2 at the end of your turn.`,
        turnDuration: 2,
        endOfTimedEffectAction: () => {
          sendToGameroom(
            `${name}'s scatter shots concentrate on ${opponent.name}!`
          );
          basicAttack(0);
          basicAttack(0);
        },
      })
    );
  },
});

export const a_delayedShot = new Card({
  title: "Delayed Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of 2 turns from now.`,
  effects: [6],
  hpCost: 8,
  cardAction: ({ self, name, calcEffect, basicAttack, sendToGameroom }) => {
    sendToGameroom(`${name} fires a delayed shot!`);
    const dmg = calcEffect(0);
    basicAttack(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Delayed Shot",
        description: `Deal ${dmg} x2 at the end of timed effect.`,
        turnDuration: 3,
        endOfTimedEffectAction: () => {
          sendToGameroom(`${name}'s delayed shot hits!`);
          basicAttack(0);
          basicAttack(0);
        },
      })
    );
  },
});

export const a_piercingShot = new Card({
  title: "Piercing Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg, bonus]) =>
    `DMG ${dmg}. If this character did not use an attacking move last turn, deal an additional ${bonus} DMG with 50% pierce.`,
  effects: [9, 5],
  hpCost: 10,
  cardAction: ({ name, sendToGameroom, lastCard, basicAttack }) => {
    sendToGameroom(`${name} fires a direct shot!`);
    basicAttack(0);
    if (lastCard.cardMetadata.nature !== Nature.Attack) {
      sendToGameroom(`The shot pierces the opponent!`);
      basicAttack(1, 0.5);
    }
  },
});

const polymath = new Card({
  title: "Polymath",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([buff]) =>
    `ATK+${buff}, DEF+${buff}, SPD+${buff}. Redraw your hand and roll 1 extra die next turn.`,
  effects: [1],
  cardAction: ({ self, name, sendToGameroom, selfStat, possessive }) => {
    sendToGameroom(
      `${name} taps into ${possessive} studies. ${name} redrew ${possessive} hand.`
    );

    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);

    for (let i = 0; i < self.hand.length; i++) {
      self.discardCard(0);
      self.drawCard();
    }

    self.additionalMetadata.rollsCount += 1;
    self.timedEffects.push(
      new TimedEffect({
        name: "Polymath",
        description: "Roll an extra die this turn.",
        turnDuration: 2,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.additionalMetadata.rollsCount -= 1;
        },
      })
    );
  },
});

const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) => `TrueDEF+${def} for 1 turn.`,
  effects: [20],
  priority: 2,
  cardAction: ({ self, name, game, sendToGameroom, calcEffect }) => {
    sendToGameroom(`${name} puts up an ordinary barrier.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent attacks this turn, next turn, all your moves have Priority+1.`,
  effects: [20],
  priority: 2,
  cardAction: ({ name, opponent, sendToGameroom, self, game, calcEffect }) => {
    sendToGameroom(`${name} detects ${opponent.name}'s mana.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.ability.abilityCounterEffect = (
      _game,
      _charIndex,
      _msgCache,
      _atkDmg
    ) => {
      sendToGameroom(`${name} was ready for ${opponent.name}'s attack!`);
      self.ability.abilitySelectedMoveModifierEffect = (
        _game,
        _charIdx,
        _msgCache,
        card
      ) => {
        card.priority += 1;
        self.ability.abilitySelectedMoveModifierEffect = undefined;
        return card;
      };
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Mana Detecting",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
          self.ability.abilityCounterEffect = undefined;
        },
      })
    );
  },
});

export const reversePolarity = new Card({
  title: "Reverse Polarity",
  cardMetadata: { nature: Nature.Defense, signature: true },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent attacks this turn, at this turn's end, attack with base DMG equal to the move's DMG.`,
  effects: [20],
  priority: 2,
  cardAction: ({
    sendToGameroom,
    self,
    opponent,
    calcEffect,
    game,
    flatAttack,
  }) => {
    sendToGameroom(`${self.name} puts up a reflective barrier.`);
    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);

    self.ability.abilityCounterEffect = (
      _game,
      _charIndex,
      _msgCache,
      atkDmg
    ) => {
      self.ability.abilityCounterEffect = undefined;
      self.timedEffects.push(
        new TimedEffect({
          name: "Reverse Polarity - Reflection",
          description: `Reflects with ${atkDmg} base DMG back at the attacker at the end of this turn.`,
          turnDuration: 1,
          endOfTurnAction(_game, _characterIndex, _messageCache) {
            sendToGameroom(`${self.name} reflects ${opponent.name}'s attack!`);
            flatAttack(atkDmg);
          },
        })
      );
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Reverse Polarity",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
          self.ability.abilityCounterEffect = undefined;
        },
      })
    );
  },
});

export const restraintMagic = new Card({
  title: "Restraint Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([debuff]) =>
    `Set your DEF to 1 until this turn's end. Opp's ATK-${debuff}, DEF-${debuff}, SPD-${debuff} for the next 4 turns.`,
  effects: [4],
  priority: 1,
  cardAction: ({
    name,
    self,
    sendToGameroom,
    opponent,
    calcEffect,
    flatSelfStat,
    opponentStat,
    selfStats,
  }) => {
    sendToGameroom(`${name} casts restraint magic on ${opponent.name}.`);
    const defDebuff = selfStats.DEF - 1;
    flatSelfStat(-defDebuff, StatsEnum.DEF);

    opponentStat(0, StatsEnum.ATK, -1);
    opponentStat(0, StatsEnum.DEF, -1);
    opponentStat(0, StatsEnum.SPD, -1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Restraining",
        description: `Your DEF is set to 1 until the end of this turn.`,
        turnDuration: 1,
        priority: -1,
        endOfTimedEffectAction: () => {
          flatSelfStat(defDebuff, StatsEnum.DEF);
        },
      })
    );

    const restraint = calcEffect(0);
    opponent.timedEffects.push(
      new TimedEffect({
        name: "Restrained",
        description: `ATK-${restraint}, DEF-${restraint}, SPD-${restraint}.`,
        turnDuration: 4,
        endOfTimedEffectAction: () => {
          opponentStat(0, StatsEnum.ATK);
          opponentStat(0, StatsEnum.DEF);
          opponentStat(0, StatsEnum.SPD);
        },
      })
    );
  },
});

export const hypnoticCompulsion = new Card({
  title: "Hypnotic Compulsion",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([atkDebuff]) =>
    `Opponent's ATK-${atkDebuff}. Your opponent only has their last used move next turn.`,
  effects: [2],
  cardAction: ({
    name,
    opponent,
    opponentLastCard,
    sendToGameroom,
    opponentStat,
  }) => {
    sendToGameroom(`${name} hypnotizes ${opponent.name}.`);
    opponentStat(0, StatsEnum.ATK, -1);
    opponent.skipTurn = true;
    opponent.additionalMetadata.accessToDefaultCardOptions = false;
    opponent.additionalMetadata.nextCardToPlay = opponentLastCard;

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Compelled",
        description: `Use your last used move next turn.`,
        turnDuration: 2,
        endOfTimedEffectAction: () => {
          opponent.additionalMetadata.accessToDefaultCardOptions = true;
          opponent.additionalMetadata.nextCardToPlay = undefined;
        },
      })
    );
  },
});

export const goddessHealingMagic = new Card({
  title: "Goddess' Healing Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([hp, bonusHp, def]) =>
    `Heal ${hp} HP. Heal an additional ${bonusHp} HP and gain ${def} DEF if the opponent's next move isn't an attack. Will overwrite the effect of Spot Weakness.`,
  effects: [7, 3, 2],
  cardAction: ({
    name,
    self,
    sendToGameroom,
    selfStat,
    possessive,
    reflexive,
  }) => {
    sendToGameroom(`${name} calls upon the Goddess for recovery.`);
    selfStat(0, StatsEnum.HP);
    sendToGameroom(`${name} scans for a resting spot.`);

    self.ability.abilityAfterOpponentsMoveEffect = (
      _game,
      _charIndex,
      _msgCache,
      card: Card
    ) => {
      if (card.cardMetadata.nature !== Nature.Attack) {
        sendToGameroom(
          `${name} made use of the room the opponent gave ${possessive} to steel ${reflexive}.`
        );
        selfStat(1, StatsEnum.HP);
        selfStat(2, StatsEnum.DEF);
      }
      self.ability.abilityAfterOpponentsMoveEffect = undefined;
    };
  },
});

const spotWeakness = new Card({
  title: "Spot Weakness",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([spd, atk, bonusAtk]) =>
    `SPD+${spd} ATK+${atk}. ATK+${bonusAtk} if the opponent's next move is an attack. Will overwrite the effect of Goddess' Healing Magic.`,
  effects: [2, 2, 3],
  cardAction: ({ self, name, opponent, selfStat, sendToGameroom }) => {
    sendToGameroom(
      `${name} is on the lookout for ${opponent.name}'s weaknesses.`
    );
    selfStat(0, StatsEnum.SPD);
    selfStat(1, StatsEnum.ATK);
    sendToGameroom(`${name} scans for an opening.`);

    self.ability.abilityAfterOpponentsMoveEffect = (
      _game,
      _charIndex,
      _msgCache,
      card: Card
    ) => {
      if (card.cardMetadata.nature === Nature.Attack) {
        sendToGameroom(
          `${name} found an opening in ${opponent.name}'s attack!`
        );
        selfStat(2, StatsEnum.ATK);
      }
      self.ability.abilityAfterOpponentsMoveEffect = undefined;
    };
  },
});

const methodeDeck = [
  { card: a_scatterShot, count: 2 },
  { card: a_delayedShot, count: 2 },
  { card: a_piercingShot, count: 2 },
  { card: polymath, count: 2 },
  { card: ordinaryDefensiveMagic, count: 1 },
  { card: manaDetection, count: 1 },
  { card: reversePolarity, count: 1 },
  { card: restraintMagic, count: 1 },
  { card: hypnoticCompulsion, count: 1 },
  { card: goddessHealingMagic, count: 2 },
  { card: spotWeakness, count: 1 },
];

export default methodeDeck;
