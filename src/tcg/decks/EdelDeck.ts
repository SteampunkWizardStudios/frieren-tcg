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

const pushStatus = (
  opponent: Character,
  self: Character,
  card: Card,
  empowerLevel: number
) => {
  const clone = card.clone();
  clone.empowerLevel = empowerLevel;
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
  hpCost: 5,
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
    `TrueDEF+${def} for 1 turn. If this card is played the same turn your opponent plays a defensive card, their SPD-${spd}, they redraw 2 cards. Attack with DMG ${dmg} + Forced Discards, ignoring defense.`,
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
    flatAttack,
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

    for (let i = 0; i < 2; i++) {
      redrawRandom(opponent, self);
    }

    const discards = self.additionalMetadata.forcedDiscards;
    const dmg = calcEffect(2) + discards;
    flatAttack(dmg, 1);
  },
});

const mental_fog = new Card({
  title: "Mental Fog",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 1 },
  emoji: CardEmoji.EDEL_CARD,
  description: ([spd, cost]) =>
    `Eye Contact+1. Opponent's SPD-${spd}. Their highest empowered playable card costs an additional ${cost} HP for the next 5 turns, and if it's not played, the opponent redraws 1 card.`,
  effects: [2, 5],
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
    const cost = calcEffect(1);

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Mental Fog",
        description: `Your highest empowered playable card costs an additional ${cost} HP for the next 5 turns, and if it's not played, redraw 1 card.`,
        turnDuration: 6,
        activateEndOfTurnActionThisTurn: false,
        executeAfterCardRolls: ({ game, selfIndex }) => {
          const highestEmpoweredCard = getHighestEmpowerFromCurrentDraws(
            game,
            selfIndex
          );
          highestEmpoweredCard.hpCost += cost;
          highestEmpoweredCard.onNotPlayed = function (this: Card, context) {
            const { name } = context;
            sendToGameroom(
              `${name} coudn't clear up the mental fog. ${name} redrew 1 card.`
            );
            redrawRandom(opponent, self);
          };
        },
        endOfTurnAction: (game, characterIndex) => {
          const highestEmpoweredCard = getHighestEmpowerFromCurrentDraws(
            game,
            characterIndex
          );
          highestEmpoweredCard.hpCost -= cost;
          highestEmpoweredCard.onNotPlayed = undefined;
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
    `Eye Contact+1. Heal ${hp} + Forced Discard x 2 HP. SPD+${spd}.`,
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
    flatSelfStat,
    self,
    calcEffect,
  }) => {
    sendToGameroom(`${name} focuses and clears ${possessive} mind.`);

    const hp = calcEffect(0) + self.additionalMetadata.forcedDiscards * 2;
    flatSelfStat(hp, StatsEnum.HP, game);
    selfStat(1, StatsEnum.SPD, game);
  },
});

const hypnosis_sleep = new Card({
  title: "Hypnosis: *Sleep*",
  cardMetadata: { nature: Nature.Util, hideEmpower: true, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact+2. Your opponent discards two cards, draws Sleepy and one other card.`,
  effects: [],
  cardAction: function (this: Card, { name, self, sendToGameroom, opponent }) {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Sleep*`);
    redrawRandom(opponent, self);
    pushStatus(opponent, self, sleepy, this.empowerLevel);
  },
});

const hypnosis_mesmerize = new Card({
  title: "Hypnosis: *Mesmerize*",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact+2. Your opponent discards two cards, draws Mesmerized and one other card.`,
  effects: [],
  cardAction: function (this: Card, { name, self, sendToGameroom, opponent }) {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *Look into my eyes*`
    );
    redrawRandom(opponent, self);
    pushStatus(opponent, self, mesmerized, this.empowerLevel);
  },
});

const hypnosis_weaken = new Card({
  title: "Hypnosis: *Weaken*",
  cardMetadata: { nature: Nature.Util, edelEyeContact: 2 },
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact+2. Your opponent discards two cards, draws Weakened at this empower and one other card.`,
  effects: [],
  cardAction: function (this: Card, { name, self, sendToGameroom, opponent }) {
    sendToGameroom(
      `${name} stares right at ${opponent.name}.\n> *You are feeling weak*`
    );
    redrawRandom(opponent, self);
    pushStatus(opponent, self, weakened, this.empowerLevel);
  },
});

const kneel = new Card({
  title: "*Kneel!*",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  description: ([dmg]) =>
    `DMG ${dmg} + Forced Discards x 2. Ignores defense. At the end of the turn, if your opponent has forcibly discarded over 15 cards, and have Sleepy, Mesmerized and Weakened in their deck, they lose.`,
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

    const dmg = calcEffect(0) + discards * 2;
    flatAttack(dmg, 1);

    const statusCon = ["Sleepy", "Mesmerized", "Weakened"].every((status) =>
      opponent.getAllCards().some((card) => card.title === status)
    );

    const winCon = statusCon && discards > 15;

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
