import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { FlammeTheory } from "../additionalMetadata/gameAdditionalMetadata";
import { CharacterName } from "../characters/metadata/CharacterName";

// export const a_zoltraak = new Card({
//   title: "Offensive Magic Analysis: Zoltraak",
//   cardMetadata: { nature: Nature.Attack, postAnalysis: 1 },
//   description: ([dmg]) =>
//     `DMG ${dmg}. 1 Analysis stacks will be gained after attack.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.zoltraak_image,
//     cardGif: mediaLinks.zoltraak_gif,
//   },
//   hpCost: 4,
//   effects: [8],
//   cardAction: function (this: Card, { sendToGameroom, name, basicAttack }) {
//     sendToGameroom(`${name} fired Zoltraak!`);
//     basicAttack(0);
//   },
// });

// export const fieldOfFlower = new Card({
//   title: "Spell to make a Field of Flowers",
//   cardMetadata: { nature: Nature.Util },
//   description: ([hp, endHp]) =>
//     `Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
//   cosmetic: {
//     cardGif: mediaLinks.fieldOfFlowers_gif,
//     // mediaLinks.fieldOfFlowers_image_old
//     cardImageUrl: mediaLinks.fieldOfFlowers_image,
//   },
//   emoji: CardEmoji.FLOWER_FIELD,
//   effects: [5, 3],
//   cardAction: function (
//     this: Card,
//     { self, name, selfStat, sendToGameroom, calcEffect }
//   ) {
//     sendToGameroom(`${name} conjured a field of flowers!`);

//     selfStat(0, StatsEnum.HP, game);
//     const endOfTurnHealing = calcEffect(1);

//     self.timedEffects.push(
//       new TimedEffect({
//         name: "Field of Flowers",
//         description: `Heal ${endOfTurnHealing} HP`,
//         turnDuration: 3,
//         executeEndOfTimedEffectActionOnRemoval: true,
//         endOfTurnAction: (game, characterIndex, messageCache) => {
//           messageCache.push(
//             `The Field of Flowers soothes ${name}.`,
//             TCGThread.Gameroom
//           );
//           game.characters[characterIndex].adjustStat(
//             endOfTurnHealing,
//             StatsEnum.HP
//           );
//         },
//         endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
//           messageCache.push("The Field of Flowers fades.", TCGThread.Gameroom);
//         },
//       })
//     );
//   },
// });

// export const a_judradjim = new Card({
//   title: "Destructive Lightning: Judradjim",
//   cardMetadata: { nature: Nature.Attack },
//   description: ([dmg]) => `DMG ${dmg}.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.judradjim_image,
//     cardGif: mediaLinks.judradjim_gif,
//   },
//   effects: [12],
//   hpCost: 7,
//   cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
//     sendToGameroom(`${name} sent forth Judradjim!`);
//     basicAttack(0);
//   },
// });

// export const a_vollzanbel = new Card({
//   title: "Hellfire Summoning: Vollzanbel",
//   cardMetadata: { nature: Nature.Attack },
//   description: ([dmg]) => `DMG ${dmg}`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.vollzanbel_image,
//     cardGif: mediaLinks.vollzanbel_gif,
//   },
//   effects: [17],
//   hpCost: 10,
//   cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
//     sendToGameroom(`${name} summoned Vollzanbel!`);
//     basicAttack(0);
//   },
// });

// export const barrierMagicAnalysis = new Card({
//   title: "Barrier Magic Analysis",
//   cardMetadata: { nature: Nature.Util, analysis: 2 },
//   description: ([atk, spd, def]) =>
//     `ATK+${atk}. SPD+${spd}. Opponent's DEF-${def}`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.barrierAnalysis_image,
//     cardGif: mediaLinks.barrierAnalysis_gif,
//   },
//   effects: [2, 1, 1],
//   cardAction: function (
//     this: Card,
//     { name, sendToGameroom, selfStat, opponentStat }
//   ) {
//     sendToGameroom(`${name} analyzed the opponent's defense!`);
//     selfStat(0, StatsEnum.ATK, game);
//     selfStat(1, StatsEnum.SPD, game);
//     opponentStat(2, StatsEnum.DEF, -1);
//   },
// });

// export const demonMagicAnalysis = new Card({
//   title: "Demon Magic Analysis",
//   cardMetadata: { nature: Nature.Util, analysis: 2 },
//   description: ([atk, spd, def]) => `ATK+${atk}. SPD+${spd}. DEF+${def}.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.demonAnalysis_image,
//     cardGif: mediaLinks.demonAnalysis_gif,
//   },
//   effects: [2, 2, 1],
//   cardAction: function (this: Card, { name, sendToGameroom, selfStat }) {
//     sendToGameroom(`${name} analyzed ancient demon's magic!`);
//     selfStat(0, StatsEnum.ATK, game);
//     selfStat(1, StatsEnum.SPD, game);
//     selfStat(2, StatsEnum.DEF, game);
//   },
// });

// export const ordinaryDefensiveMagic = new Card({
//   title: "Ordinary Defensive Magic",
//   cardMetadata: { nature: Nature.Defense },
//   description: ([def]) =>
//     `Increases TrueDEF by ${def} until the end of the turn.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.ordinaryDefensiveMagic_image,
//     cardGif: mediaLinks.ordinaryDefensiveMagic_gif,
//   },
//   effects: [20],
//   priority: 2,
//   cardAction: function (
//     this: Card,
//     { name, self, sendToGameroom, calcEffect }
//   ) {
//     sendToGameroom(`${name} cast ordinary defensive magic!`);

//     const def = calcEffect(0);
//     self.adjustStat(def, StatsEnum.TrueDEF, game);

//     self.timedEffects.push(
//       new TimedEffect({
//         name: "Ordinary Defensive Magic",
//         description: `Increases TrueDEF by ${def} until the end of the turn.`,
//         priority: -1,
//         turnDuration: 1,
//         metadata: { removableBySorganeil: false },
//         endOfTimedEffectAction: (_game, _characterIndex) => {
//           self.adjustStat(-def, StatsEnum.TrueDEF, game);
//         },
//       })
//     );
//   },
// });

// export const a_theHeightOfMagicBase = new Card({
//   title: `"The Height of Magic"`,
//   description: ([dmg]) =>
//     `When used with HP <= 25, Priority+1. Strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20, and set HP to 1. Treat this card as "Spell to make a Field of Flowers" when used with HP > 25.`,
//   emoji: CardEmoji.FLAMME_CARD,
//   cosmetic: {
//     cardImageUrl: mediaLinks.heightOfMagic_image,
//     cardGif: mediaLinks.heightOfMagic_gif,
//   },
//   cardMetadata: { nature: Nature.Attack, signature: true },
//   priority: 1,
//   effects: [30],
//   cardAction: function (
//     this: Card,
//     { self, name, selfStats, sendToGameroom, basicAttack }
//   ) {
//     sendToGameroom(`${name} used "The Height of Magic"`);

//     if (selfStats.HP > 25) {
//       sendToGameroom(`${name}'s HP is greater than 25. The move failed!`);
//       return;
//     }

//     sendToGameroom("The Height of Magic is on display.");
//     basicAttack(0);

//     self.adjustStat(-20, StatsEnum.DEF, game);
//     self.adjustStat(-20, StatsEnum.SPD, game);
//     self.setStat(1, StatsEnum.HP);
//   },
// });

// export const a_theHeightOfMagic = new Card({
//   ...a_theHeightOfMagicBase,
//   cardAction: () => {},
//   conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
//     const character = game.characters[characterIndex];

//     if (character.stats.stats.HP > 25) {
//       return new Card({
//         ...fieldOfFlower,
//         description: ([hp, endHp]) =>
//           `This card is treated as ${CardEmoji.FLAMME_CARD} **"The Height of Magic"** if your HP is <= 25. Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
//         empowerLevel: this.empowerLevel,
//         priority: 0,
//       });
//     } else {
//       return new Card({
//         ...a_theHeightOfMagicBase,
//         empowerLevel: this.empowerLevel,
//         priority: 1,
//       });
//     }
//   },
// });

export const incantationFieldOfFlowers = new Card({
  title: "Incantation: Field of Flowers",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turns' ends, heal ${endHp} HP. Gain 1 Sigil at the end of every turn.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 3],
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`${name} conjured a field of flowers.`);
    selfStat(0, StatsEnum.HP, game);

    const endOfTurnHealing = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP. Gain 1 Sigil.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`The Field of Flowers soothe ${name}.`);
          flatSelfStat(endOfTurnHealing, StatsEnum.HP, game);

          self.additionalMetadata.flammeSigil =
            (self.additionalMetadata.flammeSigil ?? 0) + 1;
          sendToGameroom(
            `${name} performed an incantation. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom("The Field of Flowers fade.");
        },
      })
    );
  },
});

const incantationSeductionTechnique = new Card({
  title: "Incantation: Seduction Technique",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, oppAtkDecrease, oppSpdDecrease]) =>
    `Heal ${hp} HP. Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. Gain 1 Sigil.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3, 2, 1],
  cardAction: function (
    this: Card,
    { game, self, name, sendToGameroom, selfStat, opponentStat }
  ) {
    sendToGameroom(`${name} showcases her seduction technique.`);
    selfStat(0, StatsEnum.HP, game);
    opponentStat(1, StatsEnum.ATK, game, -1);
    opponentStat(2, StatsEnum.SPD, game, -1);

    self.additionalMetadata.flammeSigil =
      (self.additionalMetadata.flammeSigil ?? 0) + 1;
    sendToGameroom(
      `${name} performed an incantation. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`
    );
  },
});

const theoryOfIrreversibility = new Card({
  title: "Theory of Irreversibility",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `This card can only be used by Flamme. All stat changes for both players are halved. HP can no longer be recovered. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, personal, sendToGameroom }) {
    if (name !== CharacterName.Flamme) {
      sendToGameroom(
        `${name} attempted to discover the Theory of Irreversibility. But ${personal} failed!`
      );
    } else {
      if (!game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility]) {
        sendToGameroom(
          `${name} discovered the Theory of Irreversibility. All stat changes for both players are halved. HP can no longer be recovered.`
        );
        game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility] =
          true;
      } else {
        sendToGameroom(
          `${name} attempted to discover the Theory of Irreversibility. But seems like it's already been discovered by someone else...`
        );
      }
    }
  },
});

const theoryOfBalance = new Card({
  title: "Theory of Balance",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `This card can only be used by Flamme. The Empower level for all card is now equal to the Turn Count. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, personal, sendToGameroom }) {
    if (name !== CharacterName.Flamme) {
      sendToGameroom(
        `${name} attempted to discover the Theory of Balance. But ${personal} failed!`
      );
    } else {
      if (!game.additionalMetadata.flammeTheory[FlammeTheory.Balance]) {
        sendToGameroom(
          `${name} discovered the Theory of Balance. The Empower level for all card is now equal to the Turn Count.`
        );
        game.additionalMetadata.flammeTheory[FlammeTheory.Balance] = true;
      } else {
        sendToGameroom(
          `${name} attempted to discover the Theory of Balance. But seems like it's already been discovered by someone else...`
        );
      }
    }
  },
});

const theoryOfPrescience = new Card({
  title: "Theory of Prescience",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `This card can only be used by Flamme. The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, personal, sendToGameroom }) {
    if (name !== CharacterName.Flamme) {
      sendToGameroom(
        `${name} attempted to discover the Theory of Prescience. But ${personal} failed!`
      );
    } else {
      if (!game.additionalMetadata.flammeTheory[FlammeTheory.Prescience]) {
        sendToGameroom(
          `${name} discovered the Theory of Prescience. The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3.`
        );
        game.additionalMetadata.flammeTheory[FlammeTheory.Prescience] = true;
      } else {
        sendToGameroom(
          `${name} attempted to discover the Theory of Prescience. But seems like it's already been discovered by someone else...`
        );
      }
    }
  },
});

const theoryOfSoul = new Card({
  title: "Theory of Soul",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `This card can only be used by Flamme. Both players swap their own active and discard piles. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (
    this: Card,
    { game, name, personal, sendToGameroom, self, opponent }
  ) {
    if (name !== CharacterName.Flamme) {
      sendToGameroom(
        `${name} attempted to discover the Theory of Soul. But ${personal} failed!`
      );
    } else {
      if (!game.additionalMetadata.flammeTheory[FlammeTheory.Soul]) {
        sendToGameroom(
          `${name} discovered the Theory of Soul. Both players swap their own active and discard piles.`
        );
        game.additionalMetadata.flammeTheory[FlammeTheory.Soul] = true;

        [self.deck.activePile, self.deck.discardPile] = [
          self.deck.discardPile,
          self.deck.activePile,
        ];
        [opponent.deck.activePile, opponent.deck.discardPile] = [
          opponent.deck.discardPile,
          opponent.deck.activePile,
        ];
      } else {
        sendToGameroom(
          `${name} attempted to discover the Theory of Soul. But seems like it's already been discovered by someone else...`
        );
      }
    }
  },
});

const flammeDeck = [
  // { card: a_zoltraak, count: 2 },
  // { card: a_judradjim, count: 2 },
  // { card: a_vollzanbel, count: 2 },
  // { card: barrierMagicAnalysis, count: 3 },
  // { card: demonMagicAnalysis, count: 2 },
  // { card: ordinaryDefensiveMagic, count: 2 },
  { card: incantationFieldOfFlowers, count: 3 },
  { card: incantationSeductionTechnique, count: 3 },
  { card: theoryOfIrreversibility, count: 1 },
  { card: theoryOfBalance, count: 1 },
  { card: theoryOfPrescience, count: 1 },
  { card: theoryOfSoul, count: 1 },
  // { card: a_theHeightOfMagic, count: 1 },
];

export default flammeDeck;
