import Card, { Nature } from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

const a_staffStrike = new Card({
  title: "Staff Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) =>
    `SPD+${spd}. Afterwards, HP-7, attack for DMG ${dmg}+SPD/7`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 7],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} struck with ${character.cosmetic.pronouns.possessive} staff!`,
      TCGThread.Gameroom
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 7;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

const a_staffBash = new Card({
  title: "Staff Bash",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-7, DMG ${dmg}+SPD/6`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 8],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} bashed ${character.cosmetic.pronouns.possessive} staff!`,
      TCGThread.Gameroom
    );

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 6;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

export const a_whip = new Card({
  title: "Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-7, DMG ${dmg}+SPD/5`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [1, 9],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} turned ${character.cosmetic.pronouns.possessive} staff into a whip!`,
      TCGThread.Gameroom
    );

    const speed = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(speed, StatsEnum.SPD);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.SPD / 5;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

export const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([def, hp]) => `DEF+${def} for 2 turns. Heal ${hp} HP.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} hid behind coverings!`,
      TCGThread.Gameroom
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defIncrease, StatsEnum.DEF);

    character.timedEffects.push(
      new TimedEffect({
        name: "Hide",
        description: `Increases DEF by ${defIncrease} for 2 turns.`,
        priority: -1,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} came out of hiding.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-1 * defIncrease, StatsEnum.DEF);
        },
      })
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.HP
    );
  },
});

export const a_supersonicStrike = new Card({
  title: "Supersonic Strike",
  description: ([dmg]) => `HP-7, DMG ${dmg}+SPD/4`,
  emoji: CardEmoji.LAUFEN_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} struck at supersonic speed!`,
      TCGThread.Gameroom
    );

    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.SPD / 4;
    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 7 });
  },
});

const quickDodge = new Card({
  title: "Quick Dodge",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, spdBuff]) =>
    `Priority+2. SPD+${spd}. Increases SPD by an additional ${spdBuff} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 27],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} dodged away!`, TCGThread.Gameroom);

    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);
    const spdIncreaseTemp = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(spdIncreaseTemp, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Quick Dodge",
        description: `Increases SPD by ${spdIncreaseTemp} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-1 * spdIncreaseTemp, StatsEnum.SPD);
        },
      })
    );
  },
});

export const parry = new Card({
  title: "Parry",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} switched to a parrying stance!`,
      TCGThread.Gameroom
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defIncrease, StatsEnum.DEF);

    character.timedEffects.push(
      new TimedEffect({
        name: "Parry",
        description: `Increases DEF by ${defIncrease} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-1 * defIncrease, StatsEnum.DEF);
        },
      })
    );
  },
});

export const jilwer = new Card({
  title: "Jilwer",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) =>
    `Increases SPD by ${spd} for 2 turns. At the end of every turn, HP-10.`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [50],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1363008456306725004/Jilwer.gif?ex=6807c3cb&is=6806724b&hm=21c109a6e16515d4ee652bb3d730625a7dda49bacb56ad286a0b303d39c26d72&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} used Jilwer!`, TCGThread.Gameroom);

    const turnCount = 2;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    character.timedEffects.push(
      new TimedEffect({
        name: "Jilwer",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns.`,
        turnDuration: turnCount,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} tires ${character.cosmetic.pronouns.reflexive} out.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-10, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} exits ${character.cosmetic.pronouns.possessive} Jilwer state.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
      })
    );
  },
});

export const laufenDeck = [
  { card: a_staffStrike, count: 2 },
  { card: a_staffBash, count: 2 },
  { card: a_whip, count: 2 },
  { card: hide, count: 2 },
  { card: a_supersonicStrike, count: 2 },
  { card: quickDodge, count: 2 },
  { card: parry, count: 2 },
  { card: jilwer, count: 2 },
];
