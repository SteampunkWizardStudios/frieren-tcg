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
    `SPD+${spd}. Afterwards, HP-2, attack for DMG ${dmg}+SPD/7`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [3, 7],
  hpCost: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

const a_staffBash = new Card({
  title: "Staff Bash",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-3, DMG ${dmg}+SPD/6`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [2, 8],
  hpCost: 3,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365418943023681656/GIF_0570739142.gif?ex=681088bc&is=680f373c&hm=11d929f2c7b8bbc30b003a0d981cf02eb802b3651ba64f281ca1f5e0fa36b358&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

export const a_whip = new Card({
  title: "Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, dmg]) => `SPD+${spd}. Afterwards, HP-4, DMG ${dmg}+SPD/5`,
  emoji: CardEmoji.LAUFEN_CARD,
  effects: [1, 9],
  hpCost: 4,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365419009721499718/GIF_3626022317.gif?ex=681088cc&is=680f374c&hm=838847fac81db2afc9448524255aceece7c3015a4af205b3014cd79ba565380c&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

export const a_supersonicStrike = new Card({
  title: "Supersonic Strike",
  description: ([dmg]) => `HP-5, DMG ${dmg}+SPD/4`,
  emoji: CardEmoji.LAUFEN_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [10],
  hpCost: 5,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1366373963789242388/GIF_0816288304-ezgif.com-optimize.gif?ex=6810b66a&is=680f64ea&hm=04b17a787656912d7075211221d149c8eaca57ca5ca916c27ab634fedaa75fb0&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} struck at supersonic speed!`,
      TCGThread.Gameroom
    );

    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.SPD / 4;
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: this.hpCost,
    });
  },
});

export const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, hp]) => `SPD+${spd}. Heal ${hp} HP.`,
  emoji: CardEmoji.DONUT_CARD,
  effects: [2, 7],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365422814097707120/GIF_3467240538.gif?ex=68108c57&is=680f3ad7&hm=afdbfcbce169548db1583e2f07027c57cf975b395500daee05e77e21a6b96b48&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} hid behind coverings!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.HP
    );
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
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365419393307377684/GIF_1047990200.gif?ex=68108927&is=680f37a7&hm=f99fc20e4da10efce076e95809cf6f4349da36e3fdd8600003877c1589a37ea6&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
        removableBySorganeil: false,
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
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365423837218472137/GIF_2008541989.gif?ex=68108d4b&is=680f3bcb&hm=886ee4f02a75662b1f11b3b64fbe46edada132bdffb20d022907d8df3ba15a33&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
        removableBySorganeil: false,
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
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
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
        executeEndOfTimedEffectActionOnRemoval: true,
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
