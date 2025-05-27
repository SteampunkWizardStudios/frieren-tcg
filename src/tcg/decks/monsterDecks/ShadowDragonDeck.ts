// import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
// import Card, { Nature } from "../../card";
// import { CardEmoji } from "../../formatting/emojis";
// import { StatsEnum } from "../../stats";
// import TimedEffect from "../../timedEffect";
// import CommonCardAction from "../../util/commonCardActions";
// import { a_curse } from "./CosmicTonDeck";

// const a_shadowImpalement = new Card({
//   title: "Shadow Impalement",
//   cardMetadata: { nature: Nature.Attack },
//   description: ([dmg]) => `DMG ${dmg}.`,
//   emoji: CardEmoji.PUNCH,
//   effects: [10],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} dropped a shadow nail!`,
//       TCGThread.Gameroom
//     );

//     const damage = this.calculateEffectValue(this.effects[0]);
//     CommonCardAction.commonAttack(game, characterIndex, { damage });
//   },
// });

// const camouflage = new Card({
//   title: "Camouflage",
//   cardMetadata: { nature: Nature.Util },
//   description: ([atk, def]) =>
//     `ATK+${atk} for 3 turns. DEF+${def} for 3 turns.`,
//   emoji: CardEmoji.HOURGLASS,
//   effects: [3, 3],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} camouflaged ${character.cosmetic.pronouns.reflexive} in the shadow!`,
//       TCGThread.Gameroom
//     );

//     const atk = this.calculateEffectValue(this.effects[0]);
//     const def = this.calculateEffectValue(this.effects[1]);
//     character.adjustStat(atk, StatsEnum.ATK);
//     character.adjustStat(def, StatsEnum.DEF);
//     character.timedEffects.push(
//       new TimedEffect({
//         name: "Camouflage",
//         description: `ATK+${atk} for 3 turns. DEF+${def} for 3 turns.`,
//         turnDuration: 3,
//         metadata: { removableBySorganeil: false },
//         endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
//           messageCache.push(
//             `${character.name} came out of ${character.cosmetic.pronouns.possessive} camouflage!`,
//             TCGThread.Gameroom
//           );
//           character.adjustStat(-atk, StatsEnum.ATK);
//           character.adjustStat(-def, StatsEnum.DEF);
//         },
//       })
//     );
//   },
// });

// export const a_dragonfire = new Card({
//   title: `Dragon Fire`,
//   description: ([dmg]) => `DMG ${dmg}. Reduces the opponent's DEF to 1.`,
//   emoji: CardEmoji.PUNCH,
//   effects: [10],
//   cardMetadata: { nature: Nature.Attack, signature: true },
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} breath forth a purple stream of flame!`,
//       TCGThread.Gameroom
//     );

//     const damage = this.calculateEffectValue(this.effects[0]);
//     if (
//       CommonCardAction.commonAttack(game, characterIndex, {
//         damage,
//       }) > 0
//     ) {
//       const opponent = game.getCharacter(1 - characterIndex);
//       opponent.setStat(1, StatsEnum.DEF);
//     }
//   },
// });

// export const shadowDragonDeck = [
//   { card: a_curse, count: 5 },
//   { card: a_shadowImpalement, count: 4 },
//   { card: camouflage, count: 5 },
//   { card: a_dragonfire, count: 1 },
// ];
