import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import Character from "@tcg/character";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { sleepy, mesmerized, weakened } from "@decks/utilDecks/edelStatuses";
import mediaLinks from "../formatting/mediaLinks";
import Game from "@tcg/game";

const redrawRandom = (opponent: Character, self: Character) => {
  const randomIndex = Math.floor(Math.random() * opponent.hand.length);
  opponent.discardCard(randomIndex);
  opponent.drawCard();
  self.additionalMetadata.forcedDiscards++;
};

const getHighestEmpower = (game: Game, characterIndex: number) => {
  const currentDraws = game.additionalMetadata.currentDraws;
  const possible = currentDraws[characterIndex];

  return Object.entries(possible).reduce<[string, Card]>(
    ([, highest], [key, card]) => {
      return card.empowerLevel > highest.empowerLevel
        ? [key, card]
        : [key, highest];
    },
    Object.entries(possible)[0]
  )[1];
};

export const telekinesis = new Card({
  title: "Telekinesis",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  cosmetic: {
    cardGif: mediaLinks.telekinesis_gif,
  },
  description: ([dmg]) => `Your opponent redraws 2 cards. DMG ${dmg}.`,
  effects: [14],
  hpCost: 8,
  cardAction: ({ name, self, opponent, sendToGameroom, basicAttack }) => {
    sendToGameroom(`${name} used a telekinetic attack!`);

    for (let i = 0; i < 2; i++) {
      redrawRandom(opponent, self);
    }

    basicAttack(0);
  },
});

export const one_step_ahead = new Card({
  title: "One Step Ahead",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.EDEL_CARD,
  description: ([def, spd, dmg]) =>
    `DEF+${def} for 1 turn. If this card is played the same turn your opponent plays a defensive card, their SPD-${spd}, they redraw 1 card, and attack with DMG ${dmg} ignoring all defense.`,
  effects: [20, 2, 10],
  priority: 3,
  cardAction: ({
    self,
    opponent,
    name,
    calcEffect,
    sendToGameroom,
    selfStat,
    opponentStat,
    basicAttack,
  }) => {
    sendToGameroom(`${name} put up a full coverage defense.`);
    selfStat(0, StatsEnum.DEF);

    const def = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Full Coverage Defense",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(-def, StatsEnum.DEF);
        },
      })
    );

    if (
      opponent.additionalMetadata.selectedCard?.cardMetadata.nature !==
      Nature.Defense
    ) {
      return;
    }

    sendToGameroom(
      `${opponent.name} is playing a defensive card. ${name} read ${opponent.cosmetic.pronouns.possessive} mind!`
    );
    opponentStat(1, StatsEnum.SPD, -1);
    redrawRandom(opponent, self);
    basicAttack(2, 1);
  },
});

const mental_fog = new Card({
  title: "Mental Fog",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  description: ([spd, cost]) =>
    `Eye Contact next turn. Opponent's SPD-${spd} and they redraw a card. Their highest empowered card they draw will cost ${cost} additional HP for the next 5 turns.`,
  effects: [2, 7],
  hpCost: 10,
  cardAction: ({
    name,
    self,
    opponent,
    opponentStat,
    sendToGameroom,
    calcEffect,
  }) => {
    sendToGameroom(
      `${name} hypnotizes ${opponent.name} and ${opponent.cosmetic.pronouns.personal} starts to blank out.`
    );

    self.adjustStat(1, StatsEnum.Ability);

    opponentStat(0, StatsEnum.SPD, -1);
    redrawRandom(opponent, self);

    const cost = calcEffect(1);

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Mental Fog",
        description: `The highest empowered card you draw will cost ${cost} additional HP for the next 5 turns.`,
        turnDuration: 5,
        executeAfterCardRolls: ({ game, selfIndex }) => {
          const highestEmpoweredCard = getHighestEmpower(game, selfIndex);
          highestEmpoweredCard.hpCost += cost;
        },
        endOfTurnAction: (game, characterIndex) => {
          const highestEmpoweredCard = getHighestEmpower(game, characterIndex);
          highestEmpoweredCard.hpCost -= cost;
        },
      })
    );
  },
});

const clear_mind = new Card({
  title: "Clear Mind",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  description: ([hp, spd]) =>
    `Heal ${hp} HP. SPD+${spd}. Eye Contact next turn. Both players redraw their hand.`,
  effects: [10, 2],
  cardAction: ({
    name,
    possessive,
    sendToGameroom,
    selfStat,
    self,
    opponent,
  }) => {
    sendToGameroom(`${name} focuses and clears ${possessive} mind.`);

    self.adjustStat(1, StatsEnum.Ability);

    selfStat(0, StatsEnum.HP);
    selfStat(1, StatsEnum.SPD);

    [opponent, self].forEach((player) => {
      const initialHandSize = player.hand.length;
      for (let i = 0; i < initialHandSize; i++) {
        if (player.hand.length > 0) {
          player.discardCard(0);
		  self.additionalMetadata.forcedDiscards++;
          player.drawCard();
        } else {
          break;
        }
      }
    });
  },
});

const hypnosis_sleep = new Card({
  title: "Hypnosis: *Sleep*",
  cardMetadata: { nature: Nature.Util, hideEmpower: true },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Add Sleepy to your opponent's hand, they discard a card.`,
  effects: [],
  cardAction: ({ name, self, sendToGameroom, opponent }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Sleep*`);

	self.adjustStat(1, StatsEnum.Ability);

    opponent.discardCard(0);
    opponent.hand.push(sleepy.clone());
    self.additionalMetadata.forcedDiscards++;
    opponent.additionalMetadata.sleepyCount++;
  },
});

const hypnosis_mesmerize = new Card({
  title: "Hypnosis: *Mesmerize*",
  cardMetadata: { nature: Nature.Util, hideEmpower: true },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Add Mesmerize to your opponent's hand, they discard a card.`,
  effects: [],
  cardAction: ({ name, self, sendToGameroom, opponent }) => {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *Look into my eyes*`
    );

    self.adjustStat(2, StatsEnum.Ability);

    opponent.discardCard(0);
    opponent.hand.push(mesmerized.clone());
    self.additionalMetadata.forcedDiscards++;
    opponent.additionalMetadata.mesmerizedCount++;
  },
});

const hypnosis_weaken = new Card({
  title: "Hypnosis: *Weaken*",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  description: ([_debuff]) =>
    `Eye Contact next 2 turns Add Weakened at this empower to your opponent's hand, they discard a card.`,
  effects: [2],
  cardAction: function (
    this: Card,
    { name, self, sendToGameroom, opponent }
  ) {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *You are feeling weak*`
    );

    self.adjustStat(2, StatsEnum.Ability);

    const clone = weakened.clone();
    clone.empowerLevel = this.empowerLevel;
    opponent.discardCard(0);
    opponent.hand.push(clone);
    self.additionalMetadata.forcedDiscards++;
    opponent.additionalMetadata.weakenedCount++;
  },
});

const kneel = new Card({
  title: "*Kneel!*",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  description: ([dmg, discardFactor]) =>
    `DMG ${dmg} + ${discardFactor} per each card you've forced your opponent to discard this match. Ignores defense. At the end of the turn, if your opponent has forcibly discarded over 10 cards, and have Sleepy, Mesmerized and Weakened in their deck, they lose.`,
  effects: [10, 3],
  hpCost: 10,
  cardAction: ({
    name,
    sendToGameroom,
    self,
    opponent,
    opponentIndex,
    calcEffect,
    flatAttack,
    game,
  }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Kneel!*`);

    const discards = self.additionalMetadata.forcedDiscards;

    const dmg = calcEffect(0) + calcEffect(1) * discards;
    flatAttack(dmg);

    const { sleepyCount, mesmerizedCount, weakenedCount } =
      opponent.additionalMetadata;
    const winCon =
      sleepyCount > 0 &&
      mesmerizedCount > 0 &&
      weakenedCount > 0 &&
      discards > 10;

    if (winCon) {
      sendToGameroom(`${opponent.name}'s mind has been invaded by ${name}!`);
      game.additionalMetadata.forfeited[opponentIndex] = true;
    }
  },
});

const edelDeck = [
  { card: telekinesis, count: 2 },
  { card: one_step_ahead, count: 2 },
  { card: mental_fog, count: 2 },
  { card: clear_mind, count: 2 },
  { card: hypnosis_sleep, count: 2 },
  { card: hypnosis_mesmerize, count: 2 },
  { card: hypnosis_weaken, count: 2 },
  { card: kneel, count: 2 },
];

export default edelDeck;
