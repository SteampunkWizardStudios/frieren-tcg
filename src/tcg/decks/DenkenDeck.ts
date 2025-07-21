import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "../formatting/mediaLinks";

const a_jab = new Card({
  title: "Jab",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, atk, spd, dmg]) =>
    `DEF+${def}. ATK+${atk}. SPD+${spd}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [1, 1, 1, 2],
  hpCost: 2,
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
      StatsEnum.DEF,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[2]),
      StatsEnum.SPD,
      game
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[3]),
    });
  },
});

const a_hook = new Card({
  title: "Hook",
  cardMetadata: { nature: Nature.Attack },
  description: ([spd, atk, dmg]) => `SPD+${spd}. ATK+${atk}. Deal ${dmg} DMG.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [2, 1, 2],
  hpCost: 2,
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
      StatsEnum.SPD,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK,
      game
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
  hpCost: 3,
  cosmetic: {
    cardGif: mediaLinks.denken_uppercut_gif,
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
      StatsEnum.ATK,
      game
    );
    character.adjustStat(
      this.calculateEffectValue(this.effects[1]),
      StatsEnum.SPD,
      game
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
    { game, selfIndex: characterIndex, messageCache, possessive }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} raised ${possessive} hands to prepare to block the opponent's attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF, game);

    const tempDef = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(tempDef, StatsEnum.TrueDEF, game);

    character.timedEffects.push(
      new TimedEffect({
        name: "Block",
        description: `Increases TrueDEF by ${tempDef} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-tempDef, StatsEnum.TrueDEF, game);
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
    cardGif: mediaLinks.denken_waldgose_gif,
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
    `HP-9. DMG ${dmg}. Afterwards, all your attacks receive 20% Pierce for the duration of any currently active Waldgose. Treat this card as "Hook" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [12],
  hpCost: 0, // hpCost variable at cast time
  cosmetic: {
    cardGif: mediaLinks.denken_daosdorg_gif,
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

        character.additionalMetadata.pierceFactor += 0.2;
        character.timedEffects.push(
          new TimedEffect({
            name: "Hellfire: Daosdorg",
            description: `All your attacks receive +20% Pierce.`,
            turnDuration: daosdorgTurnDuration,
            priority: -1,
            executeEndOfTimedEffectActionOnRemoval: true,
            endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
              messageCache.push(`The hellfire quietens.`, TCGThread.Gameroom);
              character.additionalMetadata.pierceFactor -= 0.2;
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
  title: "Lights of Judgement: Catastravia",
  cardMetadata: { nature: Nature.Attack },
  description: ([initDmg, turn2DMG, turn3DMG]) =>
    `HP-15. DMG ${initDmg}. At the end of the next 2 turns, deal DMG ${turn2DMG}x2 and DMG ${turn3DMG}x3 respectively. Treat this card as "Uppercut" if the user's HP is <= 0.`,
  emoji: CardEmoji.DENKEN_CARD,
  effects: [9, 3, 3],
  hpCost: 0, // hpCost variable at cast time
  cosmetic: {
    cardGif: mediaLinks.denken_catastravia_gif,
  },
  cardAction: function (this: Card, context) {
    const {
      self,
      name,
      sendToGameroom,
      selfStats,
      flatSelfStat,
      basicAttack,
      calcEffect,
      flatAttack,
    } = context;

    const catastraviaHpCost = 15;

    if (selfStats.HP <= 0) {
      const uppercut = new Card({
        ...a_uppercut,
        empowerLevel: this.empowerLevel,
      });

      flatSelfStat(-uppercut.hpCost, StatsEnum.HP);
      uppercut.cardAction(context);
    } else {
      flatSelfStat(-catastraviaHpCost, StatsEnum.HP);
      sendToGameroom(`${name} covered the sky in stars.`);
      basicAttack(0);

      const turn2Damage = calcEffect(1);
      self.timedEffects.push(
        new TimedEffect({
          name: "Catastravia: Stream of Cosmic Debris",
          description: `Deal ${turn2Damage} x2 damage at the end of the Timed Effect.`,
          turnDuration: 2,
          endOfTimedEffectAction: () => {
            sendToGameroom("The lights of judgement lit up the sky.");
            for (let i = 0; i < 2; i++) {
              flatAttack(turn2Damage);
            }
          },
        })
      );

      const turn3Damage = calcEffect(2);
      self.timedEffects.push(
        new TimedEffect({
          name: "Catastravia: Dawn of Judgement",
          description: `Deal ${turn3Damage} x3 damage at the end of the Timed Effect.`,
          turnDuration: 3,
          endOfTimedEffectAction: () => {
            sendToGameroom("The lights of judgement lit up the sky.");
            for (let i = 0; i < 3; i++) {
              flatAttack(turn3Damage);
            }
          },
        })
      );
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
  cosmetic: {
    cardGif: mediaLinks.denken_defensive_gif,
  },
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
    character.adjustStat(def, StatsEnum.TrueDEF, game);
    character.timedEffects.push(
      new TimedEffect({
        name: "Elementary Defensive Magic",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.TrueDEF, game);
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
    cardGif: mediaLinks.denken_noPlaceToGiveUp_gif,
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
    character.adjustStat(healingFirst, StatsEnum.HP, game);

    if (healAdditional) {
      messageCache.push(
        `${character.name} cannot give up!`,
        TCGThread.Gameroom
      );
      character.adjustStat(healingSecond, StatsEnum.HP, game);
      character.adjustStat(1, StatsEnum.Ability, game);
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
