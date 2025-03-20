import Deck from "../deck";
import Card from "../card";
import { offensiveMagic } from "./utilDecks/offensiveMagic";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { fieldOfFlower } from "./FrierenDeck";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_livingGrimoire = new Card({
  title: "Living Grimoire",
  description: () => "Use a random offensive magic",
  emoji: CardEmoji.SERIE_CARD,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} found an interesting magic.`,
      TCGThread.Gameroom,
    );

    const baseCard =
      offensiveMagic[Math.floor(Math.random() * offensiveMagic.length)];
    const newCard = new Card({
      ...baseCard,
      empowerLevel: this.empowerLevel,
    });

    messageCache.push(
      `${character.name} used **${newCard.getTitle()}**.`,
      TCGThread.Gameroom,
    );
    newCard.cardAction(game, characterIndex, messageCache);
  },
});

const a_livingGrimoire1 = new Card({
  ...a_livingGrimoire,
  empowerLevel: 1,
});

const a_livingGrimoire2 = new Card({
  ...a_livingGrimoire,
  empowerLevel: 2,
});

const mock = new Card({
  title: "Mock",
  description: ([hp, def, spd]) =>
    `HP+${hp}. Opponent's DEF-${def}. Opponent's SPD-${spd}`,
  emoji: CardEmoji.SERIE_CARD,
  effects: [3, 2, 1],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} mocked the opponent.`,
      TCGThread.Gameroom,
    );

    const opponent = game.getCharacter(1 - characterIndex);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP,
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[1]),
      StatsEnum.DEF,
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD,
    );
  },
});

const basicDefensiveMagic = new Card({
  title: "Basic Defensive Magic",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SERIE_CARD,
  effects: [30],
  priority: 1,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} cast basic defensive magic!`,
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

const unbreakableBarrier = new Card({
  title: "Unbreakable Barrier",
  description: ([atk, def, oppSpd]) =>
    `HP-7. ATK+${atk} for 3 turns. DEF+${def} for 3 turns. Opponent's SPD-${oppSpd} for 3 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  effects: [3, 3, 3],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} deployed an unbreakable barrier.`,
      TCGThread.Gameroom,
    );

    if (character.adjustStat(-7, StatsEnum.HP)) {
      const opponent = game.getCharacter(1 - characterIndex);
      const atkBuff = this.calculateEffectValue(this.effects[0]);
      const defBuff = this.calculateEffectValue(this.effects[1]);
      const spdDebuff = this.calculateEffectValue(this.effects[2]);

      character.adjustStat(atkBuff, StatsEnum.ATK);
      character.adjustStat(defBuff, StatsEnum.DEF);
      opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD);

      character.timedEffects.push(
        new TimedEffect({
          name: "Unbreakable Barrier",
          description: `DEF+${defBuff}, Opponent's SPD -${spdDebuff} for 3 turns.`,
          turnDuration: 3,
          endOfTimedEffectAction: (_game, _characterIndex) => {
            messageCache.push("The barrier dissipated.", TCGThread.Gameroom);
            character.adjustStat(-1 * atkBuff, StatsEnum.ATK);
            character.adjustStat(-1 * defBuff, StatsEnum.DEF);
            opponent.adjustStat(spdDebuff, StatsEnum.SPD);
          },
        }),
      );
    }
  },
});

const ancientBarrierMagic = new Card({
  title: "Ancient Barrier Magic",
  description: ([atk, def, oppSpd]) =>
    `HP-15. ATK+${atk} for 3 turns. Opponent's DEF-${def} for 3 turns. Opponent's SPD -${oppSpd} for 3 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  effects: [7, 7, 7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} expanded an ancient barrier magic.`,
      TCGThread.Gameroom,
    );

    if (character.adjustStat(-15, StatsEnum.HP)) {
      const opponent = game.getCharacter(1 - characterIndex);
      const atkBuff = this.calculateEffectValue(this.effects[0]);
      const defDebuff = this.calculateEffectValue(this.effects[1]);
      const spdDebuff = this.calculateEffectValue(this.effects[2]);

      character.adjustStat(atkBuff, StatsEnum.ATK);
      opponent.adjustStat(-1 * defDebuff, StatsEnum.DEF);
      opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD);

      character.timedEffects.push(
        new TimedEffect({
          name: "Ancient Barrier Magic",
          description: `An omnious barrier envelopes the battlefield...`,
          turnDuration: 3,
          endOfTimedEffectAction: (_game, _characterIndex) => {
            messageCache.push("The barrier dissipated.", TCGThread.Gameroom);

            character.adjustStat(-1 * atkBuff, StatsEnum.ATK);
            opponent.adjustStat(defDebuff, StatsEnum.DEF);
            opponent.adjustStat(spdDebuff, StatsEnum.SPD);
          },
        }),
      );
    }
  },
});

export const serieDeck = [
  { card: a_livingGrimoire, count: 3 },
  { card: a_livingGrimoire1, count: 2 },
  { card: a_livingGrimoire2, count: 2 },
  { card: fieldOfFlower, count: 2 },
  { card: mock, count: 2 },
  { card: basicDefensiveMagic, count: 1 },
  { card: unbreakableBarrier, count: 2 },
  { card: ancientBarrierMagic, count: 1 },
];
