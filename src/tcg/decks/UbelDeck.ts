import Card, {Nature} from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { MessageCache } from "../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";
import { signatureMoves } from "./utilDecks/signatureMoves"
import { a_malevolentShrine} from "./utilDecks/ubelSignature"

const a_reelseiden = new Card({
  title: "Reelseiden",
  description: ([dmg]) =>
    `HP-4 Has a 20% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [8],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 20 },
  hpCost: 4,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} slashed at ${opponent.name}!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

const a_cleave = new Card({
  title: "Cleave",
  description: ([dmg]) =>
    `HP-6. Has a 40% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [12],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 40 },
  hpCost: 6,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `A brutal slash!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

const a_dismantle = new Card({
  title: "Dismantle",
  description: ([dmg]) =>
    `HP-8. Has a 60% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [16],
  cardMetadata: { nature: Nature.Attack, ubelFailureRate: 60 },
  hpCost: 8,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `${character.name} tries to cut ${opponent.name} into pieces!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});



export const rushdown = new Card({
  title: "Rushdown",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) =>
    `Increases SPD by ${spd} for 3 turns. Attacks will not miss during this period. At the end of every turn, HP-5.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} rushes towards the ennemy!`,
      TCGThread.Gameroom
    );

    const turnCount = 3;
    const spdIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spdIncrease, StatsEnum.SPD);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Rushdown",
        description: `Increases SPD by ${spdIncrease} for ${turnCount} turns. Attacks will not miss`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },
        
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} is being reckless.`,
            TCGThread.Gameroom
          );
          character.adjustStat(-5, StatsEnum.HP);
        },

        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          _messageCache.push(`${character.name} retreats.`, TCGThread.Gameroom);
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, characterIndex) {
          character.adjustStat(-1 * spdIncrease, StatsEnum.SPD);
        },
      })
    );

    character.timedEffects.push();
  },
});

const recompose = new Card({
  title: "Recompose",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `SPD-10 for 2 turns. Heal ${hp}HP, then ${0.5*Number(hp)}HP at the end of each turn.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(`${character.name} takes cover to ponder the fleeting nature of her life.`,
      TCGThread.Gameroom
    );

    const turnCount = 2;
    character.adjustStat(-10, StatsEnum.SPD);
    const hpIncrease = this.calculateEffectValue(this.effects[0])
    character.adjustStat(hpIncrease,StatsEnum.HP);

    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Recompose",
        description: `Decreases SPD by 10 for ${turnCount} turns. Attacks will not hit`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },

        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} took a break and recoups.`,
            TCGThread.Gameroom
          );
          character.adjustStat(this.effects[0]/2, StatsEnum.HP);
        },

        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} has recomposed ${character.cosmetic.pronouns.reflexive}.`,
            TCGThread.Gameroom
          );
          character.adjustStat(10, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, characterIndex) {
          character.adjustStat(10, StatsEnum.SPD);
        },
      })
    );

    character.timedEffects.push();
  },
});

const defend = new Card({
  title: "Defend",
  cardMetadata: { nature: Nature.Defense },
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

export const sorganeil = new Card({
  title: "Sorganeil",
  cardMetadata: { nature: Nature.Util },
  description: () =>
    `Priority-1. Opponent can only wait next turn. Attacks will hit with 100% certainty.`,
  emoji: CardEmoji.UBEL_CARD,
  priority: -2,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    opponent.skipTurn = true;
    messageCache.push(
      `${opponent.name} got trapped in ${character.name}'s gaze!`,
      TCGThread.Gameroom
    );
    const opponentEffectsList = opponent.timedEffects;
    opponentEffectsList.splice(0, opponentEffectsList.length);
    character.timedEffects.push(
      new TimedEffect({
        name: "Sorganeil",
        description: `Cannot miss next turn's attack`,
        turnDuration: 2,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} averted ${character.cosmetic.pronouns.possessive} gaze.`,
            TCGThread.Gameroom
          );
        },
      })
    );
  },
});

export const empathy = new Card({
  title: "Empathy",
  cardMetadata: { nature: Nature.Util },
  description: () =>
    `Use the opponent's signature move at this card's empower level -2.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    if (game.turnCount <2){
      return new Card({
            title: "Hi let me stalk you",
            cardMetadata: { nature: Nature.Default },
            description: () => "Not enough time to empathize. This move will fail.",
            effects: [],
            emoji: CardEmoji.LINIE_CARD,
            cardAction: (_game, _characterIndex, messageCache: MessageCache) => {
              messageCache.push(
                `${game.getCharacter(characterIndex).name} didn't get enough time to know ${game.getCharacter(1-characterIndex).name} well enough!`,
                TCGThread.Gameroom
              );
            },
            imitated: true,
          });
    } else {const opponent = game.getCharacter(1-characterIndex);
      const signatureCard = signatureMoves[opponent.name];
      return new Card({
        ...signatureCard,
        empowerLevel: this.empowerLevel - 2,
        imitated: true,
      });
    } 
  },
});

/*
export const ubelDeck = [
  { card: a_reelseiden, count: 3 },
  { card: a_cleave, count: 2 },
  { card: a_dismantle, count: 2 },
  { card: a_malevolentShrine, count: 1 },
  { card: rushdown, count: 2 },
  { card: defend, count: 1 },
  { card: recompose, count: 2 },
  { card: sorganeil, count: 1 },
  { card: empathy, count: 1 },
];
*/

export const ubelDeck = [
  { card: a_reelseiden, count: 0 },
  { card: a_cleave, count: 0},
  { card: a_dismantle, count: 0 },
  { card: a_malevolentShrine, count: 5 },
  { card: rushdown, count: 0 },
  { card: defend, count: 0 },
  { card: recompose, count: 0 },
  { card: sorganeil, count: 5 },
  { card: empathy, count: 5 },
];
