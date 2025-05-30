// import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
// import Card, { Nature } from "../../card";
// import { CardEmoji } from "../../formatting/emojis";
// import { StatsEnum } from "../../stats";
// import TimedEffect from "../../timedEffect";
// import CommonCardAction from "../../util/commonCardActions";

// export const a_charge = new Card({
//   title: "Charge",
//   cardMetadata: { nature: Nature.Attack },
//   description: ([dmg]) => `DMG ${dmg}.`,
//   emoji: CardEmoji.PUNCH,
//   effects: [10],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(`${character.name} charged ahead!`, TCGThread.Gameroom);

//     const damage = this.calculateEffectValue(this.effects[0]);
//     CommonCardAction.commonAttack(game, characterIndex, { damage });
//   },
// });

// const earPiercingScream = new Card({
//   title: "Ear Piercing Scream",
//   cardMetadata: { nature: Nature.Util },
//   description: ([def]) => `Opponent's DEF-${def}.`,
//   emoji: CardEmoji.ENERGY,
//   effects: [5],
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     const opponent = game.getCharacter(1 - characterIndex);
//     messageCache.push(
//       `${character.name} let out an ear-piercing scream!`,
//       TCGThread.Gameroom
//     );

//     character.adjustStat(-2, StatsEnum.HP, game);
//     opponent.adjustStat(
//       -1 * this.calculateEffectValue(this.effects[0]),
//       StatsEnum.DEF
//     );
//   },
// });

// const hide = new Card({
//   title: "Hide",
//   cardMetadata: { nature: Nature.Defense },
//   description: ([def]) => `Increases DEF by ${def} until the end of the turn.`,
//   emoji: CardEmoji.SHIELD,
//   effects: [20],
//   priority: 2,
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} made a quick retreat!`,
//       TCGThread.Gameroom
//     );

//     const def = this.calculateEffectValue(this.effects[0]);
//     character.adjustStat(def, StatsEnum.DEF, game);
//     character.timedEffects.push(
//       new TimedEffect({
//         name: "Hide",
//         description: `Increases DEF by ${def} until the end of the turn.`,
//         priority: -1,
//         turnDuration: 1,
//         metadata: { removableBySorganeil: false },
//         endOfTimedEffectAction: (_game, _characterIndex) => {
//           character.adjustStat(-def, StatsEnum.DEF, game);
//         },
//       })
//     );
//   },
// });

// export const a_roomCollapse = new Card({
//   title: `Room Collapse`,
//   description: ([dmg]) =>
//     `DMG ${dmg}. Reduces the user's HP to 1. Does not factor in ATK in Damage calculation.`,
//   emoji: CardEmoji.PUNCH,
//   effects: [40],
//   cardMetadata: { nature: Nature.Attack, signature: true },
//   cardAction: function (
//     this: Card,
//     { game, selfIndex: characterIndex, messageCache }
//   ) {
//     const character = game.getCharacter(characterIndex);
//     messageCache.push(
//       `${character.name} collapsed the ceiling!`,
//       TCGThread.Gameroom
//     );
//     character.setStat(1, StatsEnum.HP);
//     const damage =
//       this.calculateEffectValue(this.effects[0]) - character.stats.stats.ATK;
//     CommonCardAction.commonAttack(game, characterIndex, { damage });
//   },
// });

// export const stoneGeiselDeck = [
//   { card: a_charge, count: 5 },
//   { card: hide, count: 5 },
//   { card: earPiercingScream, count: 4 },
//   { card: a_roomCollapse, count: 1 },
// ];
