import Deck from "../deck";
import Card from "../card";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import CommonCardAction from "../util/commonCardActions";
import { CharacterName } from "../characters/metadata/CharacterName";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_axeSwipe = new Card({
  title: "Axe Swipe",
  description: ([dmg]) => `HP-5. DMG ${dmg}`,
  emoji: CardEmoji.STARK_CARD,
  effects: [9],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} swiped ${character.cosmetic.pronouns.possessive} axe!`,
      TCGThread.Gameroom,
    );
    CommonCardAction.commonAttack(
      game,
      characterIndex,
      {
        damage: this.calculateEffectValue(this.effects[0]),
        hpCost: 5,
      }
    );
  },
});

const offensiveStance = new Card({
  title: "Offensive Stance",
  description: ([atk, spd]) =>
    `ATK+${atk}. DEF-2. SPD+${spd}. Gain <Resolve> for next 1 Attack.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2, 1],
  tags: { Resolve: 1 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} took an offensive stance!`,
      TCGThread.Gameroom,
    );

    const atkChange = this.calculateEffectValue(this.effects[0]);
    const spdChange = this.calculateEffectValue(this.effects[1]);

    character.adjustStat(atkChange, StatsEnum.ATK);
    character.adjustStat(-2, StatsEnum.DEF);
    character.adjustStat(spdChange, StatsEnum.SPD);
  },
});

const defensiveStance = new Card({
  title: "Defensive Stance",
  description: ([def, spd]) =>
    `ATK-2. DEF+${def}. SPD+${spd}. Gain <Resolve> for next 1 Attack.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2, 1],
  tags: { Resolve: 1 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} took a defensive stance!`,
      TCGThread.Gameroom,
    );

    const defChange = this.calculateEffectValue(this.effects[0]);
    const spdChange = this.calculateEffectValue(this.effects[1]);

    character.adjustStat(-2, StatsEnum.ATK);
    character.adjustStat(defChange, StatsEnum.DEF);
    character.adjustStat(spdChange, StatsEnum.SPD);
  },
});

const jumboBerrySpecialBreak = new Card({
  title: "Jumbo Berry Special Break",
  description: ([def, hp]) =>
    `SPD-2 for 2 turns. DEF+${def} for 2 turns. Heal ${hp} HP`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} chowed down on a Jumbo Berry Special!`,
      TCGThread.Gameroom,
    );

    const defChange = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(-2, StatsEnum.SPD);
    character.adjustStat(defChange, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.HP,
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Jumbo Berry Special Break",
        description: `SPD-2 for 2 turns. DEF+${defChange} for 2 turns.`,
        turnDuration: 2,
        endOfTimedEffectAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The break is over. ${character.name} recomposes ${character.cosmetic.pronouns.reflexive}.`,
            TCGThread.Gameroom,
          );
          game.characters[characterIndex].adjustStat(2, StatsEnum.SPD);
          game.characters[characterIndex].adjustStat(
            -1 * defChange,
            StatsEnum.DEF,
          );
        },
      }),
    );
  },
});

const block = new Card({
  title: "Block",
  description: ([def]) =>
    `Priority+1. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [20],
  priority: 1,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to block an attack!`,
      TCGThread.Gameroom,
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Block",
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

const concentration = new Card({
  title: "Concentration",
  description: ([spd]) =>
    `Increases SPD by ${spd}. Gain <Resolve> for next 2 attacks`,
  emoji: CardEmoji.STARK_CARD,
  effects: [2],
  tags: { Resolve: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} concentrates on the battle.`,
      TCGThread.Gameroom,
    );

    const spd = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spd, StatsEnum.SPD);
  },
});

const a_ordensSlashTechnique = new Card({
  title: "Orden's Slash Technique",
  description: ([dmg]) => `HP-9. DMG ${dmg}`,
  emoji: CardEmoji.STARK_CARD,
  effects: [12],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} used Orden's Slash Technique!`,
      TCGThread.Gameroom,
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    CommonCardAction.commonAttack(game, characterIndex, {damage, hpCost: 9});
  },
});

const fearBroughtMeThisFar = new Card({
  title: "Fear Brought Me This Far",
  description: ([atkDef]) =>
    `Increases ATK and DEF by ${atkDef}. Gain <Resolve> for next 2 attacks.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [3],
  tags: { Resolve: 2 },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} resolves ${character.cosmetic.pronouns.reflexive}...`,
      TCGThread.Gameroom,
    );

    const atkDef = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(atkDef, StatsEnum.ATK);
    character.adjustStat(atkDef, StatsEnum.DEF);
  },
});

const a_eisensAxeCleave = new Card({
  title: "Eisen's Axe Cleave",
  description: ([dmg]) =>
    `HP-14. DMG ${dmg}. Cannot take any action next turn.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [18],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    if (character.name === CharacterName.Stark) {
      messageCache.push(
        `${character.name} recalls memory of ${character.cosmetic.pronouns.possessive} master's Axe Cleave!`,
        TCGThread.Gameroom,
      );
    } else {
      messageCache.push(
        `${character.name} cleaves ${character.cosmetic.pronouns.possessive} axe.`,
        TCGThread.Gameroom,
      );
    }

    const damage = this.calculateEffectValue(this.effects[0]);
    if (
      CommonCardAction.commonAttack(game, characterIndex, {damage, hpCost: 14})
    ) {
      messageCache.push(
        `${character.name} recollects ${character.cosmetic.pronouns.reflexive}. ${character.name} skips the next turn!`,
        TCGThread.Gameroom,
      );
      character.skipTurn = true;
    }
  },
});

const a_lightningStrike = new Card({
  title: "Lightning Strike",
  description: ([dmg]) =>
    `HP-17. DEF-5 for this turn. At this turn's resolution, strike for DMG ${dmg}. Cannot take any action next turn.`,
  emoji: CardEmoji.STARK_CARD,
  effects: [25],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);

    if (character.adjustStat(-17, StatsEnum.HP)) {
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
        }),
      );
      game.characters[characterIndex].timedEffects.push(
        new TimedEffect({
          name: "Impending Lightning",
          description: `Strike for ${damage} damage.`,
          turnDuration: 1,
          endOfTimedEffectAction: (game, characterIndex) => {
            messageCache.push(
              `${character.name} performs Lightning Strike!`,
              TCGThread.Gameroom,
            );
            CommonCardAction.commonAttack(
              game,
              characterIndex,
              {
                damage,
                hpCost: 0,
                isTimedEffectAttack: true
              },
            );

            messageCache.push(
              `${character.name} recollects ${character.cosmetic.pronouns.reflexive}. ${character.name} skips the next turn!`,
              TCGThread.Gameroom,
            );
            character.skipTurn = true;
          },
        }),
      );
    }
  },
});

export const starkDeck = [
  { card: a_axeSwipe, count: 2 },
  { card: offensiveStance, count: 1 },
  { card: defensiveStance, count: 1 },
  { card: jumboBerrySpecialBreak, count: 2 },
  { card: block, count: 1 },
  { card: concentration, count: 2 },
  { card: a_ordensSlashTechnique, count: 2 },
  { card: fearBroughtMeThisFar, count: 1 },
  { card: a_eisensAxeCleave, count: 2 },
  { card: a_lightningStrike, count: 1 },
];
