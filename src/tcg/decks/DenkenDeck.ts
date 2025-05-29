import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const a_jab = new Card({
  title: "Jab",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, spd, dmg]) => `DEF+${def}. SPD+${spd}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 2],
  hpCost: 1,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} jabbed with ${character.cosmetic.pronouns.possessive} fist.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[2]),
    });
  },
});

const a_hook = new Card({
  title: "Hook",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, atk, dmg]) => `SPD+${spd}. ATK+${atk}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 2],
  hpCost: 1,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} threw out a hook!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[2]),
    });
  },
});

const a_uppercut = new Card({
  title: "Uppercut",
  cardMetadata: { nature: Nature.Attack },
  description: ([atk, spd, dmg]) => `ATK+${atk}. SPD+${spd}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 3],
  hpCost: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364978489035460708/GIF_0836074812.gif?ex=680c4b87&is=680afa07&hm=84fd66beff9352aba9c037ff66d2b0e69219b34c0e3c9c5e62edbf96dc62a0f8&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const damage = this.calculateEffectValue(this.effects[2]);
    messageCache.push(
      `${character.name} threw out ${damage > 10 ? "a sharp" : "an"} uppercut from below!`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
    });
  },
});

export const bareHandedBlock = new Card({
  title: "Bare-handed Block",
  cardMetadata: { nature: Nature.Defense },
  description: ([def, tempDef]) =>
    `DEF+${def}. TrueDEF+${tempDef} until the end of the turn.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [2, 8],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} raised his hands to prepare to block the opponent's attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const tempDef = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(tempDef, StatsEnum.TrueDEF);

    character.timedEffects.push(
      new TimedEffect({
        name: "Block",
        description: `Increases TrueDEF by ${tempDef} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-tempDef, StatsEnum.TrueDEF);
        },
      })
    );
  },
});

export const a_waldgoseBase = new Card({
  title: "Tornado Winds: Waldgose",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg, multiDmg]) =>
    `HP-7. DMG ${dmg}. At the next 5 turn ends, deal ${multiDmg} DMG. Treat this card as "Jab" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [6, 1],
  hpCost: 0, // hp cost variable at cast time
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364217876323500123/GIF_0112106003.gif?ex=6808de67&is=68078ce7&hm=53339631d41657c84bff7858a0d4ca127e5dd726db694b68d34f5d833a75c8ba&",
  },
  cardAction: function (this: Card, context) {
    const {
      game,
      selfIndex: characterIndex,
      self: character,
      messageCache,
      flatSelfStat,
    } = context;

    const waldgoseHpCost = 7;

    if (character.stats.stats.HP <= 0) {
      const jab = new Card({
        ...a_jab,
        empowerLevel: this.empowerLevel,
      });
      flatSelfStat(-jab.hpCost, StatsEnum.HP);
      jab.cardAction(context);
    } else {
      flatSelfStat(-waldgoseHpCost, StatsEnum.HP);
      messageCache.push(
        `${character.name} whipped up a tornado!`,
        TCGThread.Gameroom
      );
      const damage = this.calculateEffectValue(this.effects[0]);
      CommonCardAction.commonAttack(game, characterIndex, {
        damage,
      });

      const multiDamage = this.calculateEffectValue(this.effects[1]);
      character.timedEffects.push(
        new TimedEffect({
          name: "Tornado Winds: Waldgose",
          description: `Deal ${damage} at each turn's end.`,
          turnDuration: 5,
          metadata: { denkenIsWaldgose: true },
          endOfTurnAction: function (this, game, characterIndex) {
            messageCache.push("The wind rages on!", TCGThread.Gameroom);

            CommonCardAction.commonAttack(game, characterIndex, {
              damage: multiDamage,
              isTimedEffectAttack: true,
            });
          },
        })
      );
    }
  },
});

const a_waldgose = new Card({
  ...a_waldgoseBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_jab,
        title: "Jab (Tornado Winds: Waldgose)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_waldgoseBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_daosdorgBase = new Card({
  title: "Hellfire: Daosdorg",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-9. DMG ${dmg}. Afterwards, all your attacks receive 50% Pierce for the duration of any currently active Waldgose. Treat this card as "Hook" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [12],
  hpCost: 0, // hpCost variable at cast time
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364218009102581871/GIF_4214490964.gif?ex=6808de87&is=68078d07&hm=dedf596f960aafe344c5eedec122d4dbd54c3b5c6f8b002b3cae75da891fdedf&",
  },
  cardAction: function (this: Card, context) {
    const {
      game,
      selfIndex: characterIndex,
      self: character,
      messageCache,
      flatSelfStat,
    } = context;

    const daosdorgHpCost = 9;

    if (character.stats.stats.HP <= 0) {
      const hook = new Card({
        ...a_hook,
        empowerLevel: this.empowerLevel,
      });
      flatSelfStat(-hook.hpCost, StatsEnum.HP);
      hook.cardAction(context);
    } else {
      flatSelfStat(-daosdorgHpCost, StatsEnum.HP);
      messageCache.push(
        `${character.name} set the sky aflame.`,
        TCGThread.Gameroom
      );

      CommonCardAction.commonAttack(game, characterIndex, {
        damage: this.calculateEffectValue(this.effects[0]),
      });

      let daosdorgTurnDuration = 0;
      for (const timedEffect of character.timedEffects) {
        if (timedEffect.metadata.denkenIsWaldgose) {
          daosdorgTurnDuration = Math.max(
            daosdorgTurnDuration,
            timedEffect.turnDuration
          );
        }
      }

      if (daosdorgTurnDuration > 0) {
        messageCache.push(
          `The hellfire infused itself into the raging winds!`,
          TCGThread.Gameroom
        );

        character.additionalMetadata.pierceFactor += 0.5;
        character.timedEffects.push(
          new TimedEffect({
            name: "Hellfire: Daosdorg",
            description: `All your attacks receive +25% Pierce.`,
            turnDuration: daosdorgTurnDuration,
            priority: -1,
            executeEndOfTimedEffectActionOnRemoval: true,
            endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
              messageCache.push(`The hellfire quietens.`, TCGThread.Gameroom);
              character.additionalMetadata.pierceFactor -= 0.5;
            },
          })
        );
      }
    }
  },
});

const a_daosdorg = new Card({
  ...a_daosdorgBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_hook,
        title: "Hook (Hellfire: Daosdorg)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_daosdorgBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_catastraviaBase = new Card({
  title: "Lights of Judgment: Catastravia",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg0, dmg1, dmg2, dmg3, dmg4]) =>
    `HP-15. DMG ${dmg0}, ${dmg1}, ${dmg2}, ${dmg3}, ${dmg4}. Treat this card as "Uppercut" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 3, 4, 5, 6],
  hpCost: 0, // hpCost variable at cast time
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364218121669316608/GIF_1295476803.gif?ex=6808dea2&is=68078d22&hm=bdc2fd9b990ddf12a7cb0d6ad7b24dca2a24203773cd3896f0c53681dad85ed9&",
  },
  cardAction: function (this: Card, context) {
    const {
      game,
      selfIndex: characterIndex,
      self: character,
      messageCache,
      flatSelfStat,
    } = context;

    const catastraviaHpCost = 15;

    if (character.stats.stats.HP <= 0) {
      const uppercut = new Card({
        ...a_uppercut,
        empowerLevel: this.empowerLevel,
      });

      flatSelfStat(-uppercut.hpCost, StatsEnum.HP);
      uppercut.cardAction(context);
    } else {
      flatSelfStat(-catastraviaHpCost, StatsEnum.HP);
      messageCache.push(
        `${character.name} covered the sky in stars.`,
        TCGThread.Gameroom
      );

      for (let i = 0; i < 5; i++) {
        const damage = this.calculateEffectValue(this.effects[i]);
        CommonCardAction.commonAttack(game, characterIndex, {
          damage,
        });
      }
    }
  },
});

const a_catastravia = new Card({
  ...a_catastraviaBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...a_uppercut,
        title: "Uppercut (Lights of Judgment: Catastravia)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_catastraviaBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

const elementaryDefensiveMagicBase = new Card({
  title: "Elementary Defensive Magic",
  cardMetadata: { nature: Nature.Defense, signature: true },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn. Treat this card as "Bare-handed Block" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [20],
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];

    messageCache.push(
      `${character.name} casted an elementary defensive spell!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.TrueDEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Elementary Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.TrueDEF);
        },
      })
    );
  },
});

export const elementaryDefensiveMagic = new Card({
  title: "Elementary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn. Treat this card as "Bare-handed Block" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  priority: 2,
  effects: [20],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP <= 0) {
      return new Card({
        ...bareHandedBlock,
        title: "Bare-handed Block (Elementary Defensive Magic)",
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...elementaryDefensiveMagicBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

export const a_concentratedOffensiveMagicZoltraak = new Card({
  title: "Concentrated Offensive Magic: Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [14],
  hpCost: 8,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} sent forth a concentrated blast of Zoltraak.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
    });
  },
});

export const thisIsNoPlaceToGiveUp = new Card({
  title: "This Is No Place To Give Up",
  cardMetadata: { nature: Nature.Util },
  description: ([hpFirst, hpSecond]) =>
    `Heal ${hpFirst}HP. Heal an additional ${hpSecond}HP and gain 1 Preserverance stack if HP <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [7, 7],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364979223357296802/GIF_0406490421.gif?ex=680c4c36&is=680afab6&hm=cf5c0f9d7e3e14ec143a8b304c0d416868db25cb8de5a1f0b38cc4c7507df73d&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    const healingFirst = this.calculateEffectValue(this.effects[0]);
    const healingSecond = this.calculateEffectValue(this.effects[1]);

    let healAdditional = false;
    if (character.stats.stats.HP <= 0) {
      healAdditional = true;
    }

    messageCache.push(
      `${character.name} resolves himself.`,
      TCGThread.Gameroom
    );
    character.adjustStat(healingFirst, StatsEnum.HP);

    if (healAdditional) {
      messageCache.push(
        `${character.name} cannot give up!`,
        TCGThread.Gameroom
      );
      character.adjustStat(healingSecond, StatsEnum.HP);
      character.adjustStat(1, StatsEnum.Ability);
    }
  },
});

const denkenDeck = [
  { card: a_jab, count: 2 },
  { card: a_hook, count: 2 },
  { card: a_uppercut, count: 2 },
  { card: bareHandedBlock, count: 1 },
  { card: a_waldgose, count: 2 },
  { card: a_daosdorg, count: 2 },
  { card: a_catastravia, count: 1 },
  { card: elementaryDefensiveMagic, count: 1 },
  { card: a_concentratedOffensiveMagicZoltraak, count: 2 },
  { card: thisIsNoPlaceToGiveUp, count: 1 },
];

export default denkenDeck;
