import Deck from "../deck";
import Card from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";
import { MessageCache } from "../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_reelseiden = new Card({
  title: "Reelseiden",
  description: ([dmg]) =>
    `HP-6. Has a 30% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [8],
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} slashed the opponent!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 6,
    });
  },
});

const a_cleave = new Card({
  title: "Cleave",
  description: ([dmg]) =>
    `HP-6. Has a 40% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [12],
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} slashed the opponent!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 8,
    });
  },
});

const a_dismantle = new Card({
  title: "Dismantle",
  description: ([dmg]) =>
    `HP-12. Has a 50% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [16],
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} slashed the opponent!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 12,
    });
  },
});

const a_malevolentShrine = new Card({
  title: "Malevolent Shrine",
  description: ([dmg]) =>
    `HP-15. Has a 60% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [22],
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} slashed the opponent!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: 15,
    });
  },
});



export const rushdown = new Card({
  title: "Rushdown",
  description: ([spd]) =>
    `Increases SPD by ${spd} for 3 turns. Attacks will not miss during this period. At the end of every turn, HP-5.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} rushes towards the ennemy!`, TCGThread.Gameroom);

    const turnCount = 3;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Rushdown",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns. Attacks will not miss`,
        turnDuration: turnCount,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} is being reckless.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-5, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} retreats.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
      })
    );
  },
});

const defend = new Card({
  title: "Defend",
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to defend against an incoming attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Defend",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const recompose = new Card({
  title: "Recompose",
  description: ([hp]) => `SPD-10 for 3 turns. Heal ${hp}HP.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} calms down.`,
      TCGThread.Gameroom
    );

    character.adjustStat(-10, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Recompose",
        description: `SPD-10 for 2 turns, can't land attacks.`,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} is ready to throw down again!`,
            TCGThread.Gameroom
          );
          character.adjustStat(10, StatsEnum.SPD);
          TCGThread.Gameroom;
        },
      })
    );

  },
});

export const sorganeil = new Card({
  title: "Sorganeil",
  description: ([dmg]) =>
    `Priority-1. Opponent can only wait next turn. Attacks will hit with 100% certainty.`,
  emoji: CardEmoji.UBEL_CARD,
  priority: -1,
  effects: [22],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);

    if (character.adjustStat(-15, StatsEnum.HP)) {
      messageCache.push(`${character.name} winds up...`, TCGThread.Gameroom);
      const damage = this.calculateEffectValue(this.effects[0]);

      character.adjustStat(-5, StatsEnum.DEF);
      game.characters[characterIndex].timedEffects.push(
        new TimedEffect({
          name: "Opening",
          description: `DEF-5 for this turn.`,
          turnDuration: 1,
          endOfTimedEffectAction: (game, characterIndex) => {
            game.characters[characterIndex].adjustStat(5, StatsEnum.DEF);
          },
        })
      );
      game.characters[characterIndex].timedEffects.push(
        new TimedEffect({
          name: "Impending Lightning",
          description: `Strike for ${damage} damage.`,
          turnDuration: 1,
          endOfTimedEffectAction: (game, characterIndex) => {
            messageCache.push(
              `${character.name} performs Lightning Strike!`,
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
    }
  },
});

export const empathy = new Card({
  title: `Empathy`,
  description: ([dmg]) =>
    `Will fail if used before turn 5. Use the opponents signature move at empowerement -2.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [30],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} learns a new spell!`,
      TCGThread.Gameroom
    );

    if (game.turnCount < 5) {
      messageCache.push(
        `${character.name} hasn't got enough time to empathise with ${game.characters[1 - characterIndex]}`,
        TCGThread.Gameroom
      );
    } else {
      messageCache.push(
        "The Height of Magic is on display.",
        TCGThread.Gameroom
      );
      const damage = this.calculateEffectValue(this.effects[0]);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
        hpCost: 0,
      });
      character.adjustStat(-20, StatsEnum.DEF);
      character.adjustStat(-20, StatsEnum.SPD);
      character.setStat(1, StatsEnum.HP);
    }
  },
});



export const ubelDeck = [
  { card: a_reelseiden, count: 3 },
  { card: a_cleave, count: 2 },
  { card: a_dismantle, count: 2},
  { card: a_malevolentShrine, count: 1},
  { card: rushdown, count: 2 },
  { card: defend, count: 1 },
  { card: recompose, count: 2},
  { card: sorganeil, count: 1},
  { card: empathy, count: 1}
];
