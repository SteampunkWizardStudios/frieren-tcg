import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import Character from "@tcg/character";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { sleepy, mesmerized, weakened } from "@decks/utilDecks/edelStatuses";

const redrawRandom = (opponent: Character) => {
  const randomIndex = Math.floor(Math.random() * opponent.hand.length);
  opponent.discardCard(randomIndex);
  opponent.drawCard();
};

const getHighestEmpower = (self: Character) => {
  return self.hand.reduce((highest, card) => {
    return card.empowerLevel > highest.empowerLevel ? card : highest;
  }, self.hand[0]);
}

export const telekinesis = new Card({
  title: "Telekinesis",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  cosmetic: {
    cardGif:
      "https://media.discordapp.net/attachments/1367328754795286599/1368285080606347444/Stone_hurling_spell_EP24.gif?ex=6817aa48&is=681658c8&hm=b41474c8c6b45cfcf6d65a0d1f5586e9633d1d064f0ee1ab4facd0d9b3699a84",
  },
  description: ([dmg]) => `HP-8. Your opponent redraws 2 cards. DMG ${dmg}.`,
  effects: [14],
  cardAction: ({ name, opponent, sendToGameroom, basicAttack }) => {
    sendToGameroom(`${name} used a telekinetic attack!`);

    for (let i = 0; i < 2; i++) {
      redrawRandom(opponent);
    }

    basicAttack(0, 8);
  },
});

const one_step_ahead = new Card({
  title: "One Step Ahead",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.EDEL_CARD,
  description: ([def, spd, dmg]) =>
    `Priority+3. DEF+${def} for 1 turn. If this card is played the same turn your opponent plays a defensive card, their SPD-${spd}, they redraw 1 card, and attack with DMG ${dmg} ignoring all defense.`,
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
    redrawRandom(opponent);
    basicAttack(2, 0, 1);
  },
});

const mental_fog = new Card({
  title: "Mental Fog",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  description: ([spd, cost]) =>
    `HP-10. Eye Contact next turn. Opponent's SPD-${spd} and they redraw a card. Their highest empowered card they draw will cost ${cost} additional HP for the next 5 turns.`,
  effects: [2, 7],
  cardAction: ({
    name,
    opponent,
    opponentStat,
    sendToGameroom,
    calcEffect,
  }) => {
    sendToGameroom(
      `${name} hypnotizes ${opponent.name} and ${opponent.cosmetic.pronouns.personal} starts to blank out.`
    );

    opponentStat(0, StatsEnum.SPD, -1);
    redrawRandom(opponent);

    const cost = calcEffect(1);

    opponent.timedEffects.push(
      new TimedEffect({
        name: "Mental Fog",
        description: `The highest empowered card you draw will cost ${cost} additional HP for the next 5 turns.`,
        turnDuration: 5,
        executeAfterCardRolls: () => {
          const highestEmpoweredCard = getHighestEmpower(self);
          highestEmpoweredCard.hpCost += cost;
          console.log(`${highestEmpoweredCard.printCard} cost increased by ${cost}`);
        }
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

    selfStat(0, StatsEnum.HP);
    selfStat(1, StatsEnum.SPD);

    [opponent, self].forEach((player) => {
      const initialHandSize = player.hand.length;
      for (let i = 0; i < initialHandSize; i++) {
        if (player.hand.length > 0) {
          player.discardCard(0);
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
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  printEmpower: false,
  description: () =>
    `Eye Contact next 2 turns. Add Sleepy to your opponent's deck, they redraw a card.`,
  effects: [],
  cardAction: ({ name, sendToGameroom, opponent }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Sleep*`);

    opponent.hand.push(sleepy.clone());
  },
});

const hypnosis_mesmerize = new Card({
  title: "Hypnosis: *Mesmerize*",
  cardMetadata: { nature: Nature.Util },
  printEmpower: false,
  emoji: CardEmoji.EDEL_CARD,
  description: () =>
    `Eye Contact next 2 turns. Add Mesmerize to your opponent's deck, they redraw a card.`,
  effects: [],
  cardAction: ({ name, sendToGameroom, opponent }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *Look into my eyes*`);

    opponent.hand.push(mesmerized.clone());
  },
});

const hypnosis_weaken = new Card({
  title: "Hypnosis: *Weaken*",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.EDEL_CARD,
  description: ([debuff]) =>
    `Eye Contact next 2 turns. Reduce opponent's ATK, DEF, SPD by ${debuff}. Add Weakened at this empower to your opponent's deck.`,
  effects: [2],
  cardAction: ({ name, sendToGameroom, opponent }) => {
    sendToGameroom(`${name} stares right at ${opponent.name}.\n> *You are feeling weak*`);

    opponent.hand.push(weakened.clone());
  },
});

const kneel = new Card({
  title: "*Kneel!*",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  description: ([dmg]) =>
    `HP-10. DMG ${dmg} + 3 per each card discarded this match by your opponent. Ignores defense. At the end of the turn, if your opponent has discarded more than 10 cards this match, and they have Sleepy, Mesmerized and Weakened in their deck, they lose.`,
  effects: [10],
  cardAction: () => { },
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
