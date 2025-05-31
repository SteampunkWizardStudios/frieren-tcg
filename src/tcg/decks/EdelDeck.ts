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

const pushStatus = (opponent: Character, self: Character, card: Card) => {
  const clone = card.clone();
  opponent.discardCard(0);
  opponent.hand.push(clone);
  self.additionalMetadata.forcedDiscards++;
};

const getHighestEmpowerFromCurrentDraws = (
  game: Game,
  characterIndex: number
) => {
  const currentDraws = game.additionalMetadata.currentPlayableMoves;
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
    cardGif: mediaLinks.edel_telekinesis_gif,
  },
  description: ([dmg]) => `Your opponent redraws 3 cards. DMG ${dmg}.`,
  effects: [14],
  hpCost: 8,
  cardAction: ({ name, self, opponent, sendToGameroom, basicAttack }) => {
    sendToGameroom(`${name} used a telekinetic attack!`);

    for (let i = 0; i < 3; i++) {
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
    `TrueDEF+${def} for 1 turn. If this card is played the same turn your opponent plays a defensive card, their SPD-${spd}, they redraw 1 card, and attack with DMG ${dmg} ignoring all defense.`,
  effects: [20, 2, 10],
  priority: 3,
  cardAction: ({
    self,
    game,
    opponent,
    name,
    calcEffect,
    sendToGameroom,
    selfStat,
    opponentStat,
    basicAttack,
  }) => {
    sendToGameroom(`${name} put up a full coverage defense.`);
    selfStat(0, StatsEnum.TrueDEF, game);

    const def = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Full Coverage Defense",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(
            -def,
            StatsEnum.TrueDEF,
            game
          );
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
    opponentStat(1, StatsEnum.SPD, game, -1);
    redrawRandom(opponent, self);
    basicAttack(2, 1);
  },
});

const mental_fog = new Card({
  title: "Mental Fog",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 1 },
  emoji: CardEmoji.EDEL_CARD,
  description: ([spd, cost]) =>
    `Eye Contact next turn. Opponent's SPD-${spd} and they redraw two cards. Their highest empowered card they draw will cost ${cost} additional HP for the next 5 turns.`,
  effects: [2, 7],
  hpCost: 10,
  cosmetic: {
    cardGif: mediaLinks.edel_mental_fog_gif,
  },
  cardAction: ({
    name,
    self,
    game,
    opponent,
    opponentStat,
    sendToGameroom,
    calcEffect,
  }) => {
    sendToGameroom(
      `${name} hypnotizes ${opponent.name}. ${opponent.name} starts blanking out.`
    );
    opponentStat(0, StatsEnum.SPD, game, -1);
    redrawRandom(opponent, self);
    redrawRandom(opponent, self);

    const cost = calcEffect(1);

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Mental Fog",
        description: `The highest empowered card you draw costs ${cost} additional HP.`,
        turnDuration: 6,
        activateEndOfTurnActionThisTurn: false,
        executeAfterCardRolls: ({ game, selfIndex }) => {
          const highestEmpoweredCard = getHighestEmpowerFromCurrentDraws(
            game,
            selfIndex
          );
          highestEmpoweredCard.hpCost += cost;
          console.log(highestEmpoweredCard);
        },
        endOfTurnAction: (game, characterIndex) => {
          const highestEmpoweredCard = getHighestEmpowerFromCurrentDraws(
            game,
            characterIndex
          );
          highestEmpoweredCard.hpCost -= cost;
          console.log(highestEmpoweredCard);
        },
      })
    );
  },
});

const clear_mind = new Card({
  title: "Clear Mind",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 1 },
  emoji: CardEmoji.EDEL_CARD,
  description: ([hp, spd]) =>
    `Heal ${hp} HP. SPD+${spd}. Eye Contact next turn. Both players redraw their hand.`,
  effects: [10, 2],
  cosmetic: {
    cardGif: mediaLinks.edel_clear_mind_gif,
  },
  cardAction: ({
    name,
    game,
    possessive,
    sendToGameroom,
    selfStat,
    self,
    opponent,
  }) => {
    sendToGameroom(`${name} focuses and clears ${possessive} mind.`);

    selfStat(0, StatsEnum.HP, game);
    selfStat(1, StatsEnum.SPD, game);

    [opponent, self].forEach((player, index) => {
      const initialHandSize = player.hand.length;
      for (let i = 0; i < initialHandSize; i++) {
        if (player.hand.length > 0) {
          player.discardCard(0);
          player.drawCard();
          if (index === 0) {
            self.additionalMetadata.forcedDiscards++;
          }
        } else {
          break;
        }
      }
    });
  },
});

const hypnosis_sleep = new Card({
  title: "Hypnosis: *Sleep*",
  cardMetadata: { nature: Nature.Util, hideEmpower: true, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Your opponent discards two cards, draws Sleepy and one other card.`,
  effects: [],
  cardAction: ({ name, self, sendToGameroom, opponent }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Sleep*`);
    pushStatus(opponent, self, sleepy);
    redrawRandom(opponent, self);
  },
});

const hypnosis_mesmerize = new Card({
  title: "Hypnosis: *Mesmerize*",
  cardMetadata: { nature: Nature.Util, hideEmpower: true, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Your opponent discards two cards, draws Mesmerized and one other card.`,
  effects: [],
  cardAction: ({ name, self, sendToGameroom, opponent }) => {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *Look into my eyes*`
    );
    pushStatus(opponent, self, mesmerized);
    redrawRandom(opponent, self);
  },
});

const hypnosis_weaken = new Card({
  title: "Hypnosis: *Weaken*",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Your opponent discards two cards, draws Weakened at this empower and one other card.`,
  effects: [],
  cardAction: function (this: Card, { name, self, sendToGameroom, opponent }) {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *You are feeling weak*`
    );
    pushStatus(opponent, self, weakened);
    redrawRandom(opponent, self);
  },
});

const kneel = new Card({
  title: "*Kneel!*",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  description: ([dmg]) =>
    `DMG ${dmg} + Forced Discards x 3. Ignores defense. At the end of the turn, if your opponent has forcibly discarded over 10 cards, and have Sleepy, Mesmerized and Weakened in their deck, they lose.`,
  effects: [10],
  hpCost: 10,
  cosmetic: {
    cardGif: mediaLinks.edel_kneel_gif,
  },
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

    const dmg = calcEffect(0) + 3 * discards;
    flatAttack(dmg);

    const statusCon = ["Sleepy", "Mesmerized", "Weakened"].every((status) =>
      opponent.getAllCards().some((card) => card.title === status)
    );

    const winCon = statusCon && discards > 10;

    if (winCon) {
      sendToGameroom(`${opponent.name}'s mind has been invaded by ${name}!`);
      game.additionalMetadata.forfeited[opponentIndex] = true;
    }
  },
});

const edelDeck = [
  { card: telekinesis, count: 3 },
  { card: one_step_ahead, count: 2 },
  { card: mental_fog, count: 2 },
  { card: clear_mind, count: 2 },
  { card: hypnosis_sleep, count: 2 },
  { card: hypnosis_mesmerize, count: 2 },
  { card: hypnosis_weaken, count: 2 },
  { card: kneel, count: 1 },
];

export default edelDeck;
