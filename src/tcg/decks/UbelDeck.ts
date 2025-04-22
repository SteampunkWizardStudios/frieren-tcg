import Card, { Nature } from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import { CardEmoji } from "../formatting/emojis";
import { MessageCache } from "../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";
import { signatureMoves } from "./utilDecks/signatureMoves";
import { a_malevolentShrine } from "./utilDecks/ubelSignature";

export const empathyFailureName = "Stalking";

export const a_reelseiden = new Card({
  title: "Reelseiden: Initiate",
  description: ([dmg]) =>
    `HP-4. If used by Übel, has a 20% of missing if the opponent didn't use an Attack card before this move is used. DMG ${dmg}.`,
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

export const a_cleave = new Card({
  title: "Reelseiden: Cleave",
  description: ([dmg]) =>
    `HP-6. If used by Übel,has a 40% of missing if the opponent didn't use an Attack card before this move is used. DMG ${dmg}.`,
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
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(`A brutal slash!`, TCGThread.Gameroom);

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});

export const a_dismantle = new Card({
  title: "Reelseiden: Dismantle",
  description: ([dmg]) =>
    `HP-8. If used by Übel, has a 60% of missing if the opponent didn't use an Attack card before this move is used. DMG ${dmg}.`,
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
  cosmetic: {
    cardGif:
      "https://media.discordapp.net/attachments/1360969158623232300/1364216562600509570/GIF_2060261812.gif?ex=6808dd2e&is=68078bae&hm=120ce38d9abf8a42357d0bd650f0e5c63da9ea2232bd5ceae2716ee67a2fb67f&=&width=1440&height=820",
  },
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
        replacedAction: function (this, _game, _characterIndex) {
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
  description: ([hp, endOfTurnHp]) =>
    `SPD-10 for 2 turns. Heal ${hp}HP, then ${endOfTurnHp} HP at the end of each turn. Attacks will not hit while Recompose is active.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [10, 5],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364216703541837844/GIF_2189012353.gif?ex=6808dd50&is=68078bd0&hm=644b405b52a67b684bda6bfff12ce2ffa99d091de554b967213e07aa87883a8d&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} takes cover to ponder the fleeting nature of her life.`,
      TCGThread.Gameroom
    );

    const turnCount = 2;
    character.adjustStat(-10, StatsEnum.SPD);
    const hpIncrease = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(hpIncrease, StatsEnum.HP);

    const endOfTurnHpIncrease = this.calculateEffectValue(this.effects[1]);
    CommonCardAction.replaceOrAddNewTimedEffect(
      game,
      characterIndex,
      "ubelSpeedModifiers",
      new TimedEffect({
        name: "Recompose",
        description: `Decreases SPD by 10 for ${turnCount} turns. Attacks will not hit. Heal ${endOfTurnHpIncrease} at turn end.`,
        turnDuration: turnCount,
        tags: { ubelSpeedModifiers: 1 },

        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} took a break and recoups.`,
            TCGThread.Gameroom
          );
          character.adjustStat(endOfTurnHpIncrease, StatsEnum.HP);
        },

        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} has recomposed ${character.cosmetic.pronouns.reflexive}.`,
            TCGThread.Gameroom
          );
          character.adjustStat(10, StatsEnum.SPD);
        },
        replacedAction: function (this, _game, _characterIndex) {
          character.adjustStat(10, StatsEnum.SPD);
        },
      })
    );

    character.timedEffects.push();
  },
});

export const defend = new Card({
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
        removableBySorganeil: false,
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
    `Priority-2. Will fail if the opponent's SPD is >=50. Clear opponent's timed effects. Opponent can only wait next turn. Attacks will hit with 100% certainty.`,
  emoji: CardEmoji.UBEL_CARD,
  priority: -2,
  effects: [],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);

    if (opponent.stats.stats.SPD >= 50) {
      messageCache.push(
        `${character.name}'s gaze cannot keep up with ${opponent.name}'s speed!`,
        TCGThread.Gameroom
      );
      return;
    }

    opponent.skipTurn = true;
    messageCache.push(
      `${character.name} traps ${opponent.name} in ${character.name}'s gaze!`,
      TCGThread.Gameroom
    );

    opponent.timedEffects = opponent.timedEffects.filter(
      (timedEffect) => !timedEffect.removableBySorganeil
    );
    character.timedEffects.push(
      new TimedEffect({
        name: "Sorganeil",
        description: `Cannot miss next turn's attack`,
        turnDuration: 2,
        priority: -1,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          messageCache.push(
            `${character.name} averted ${character.cosmetic.pronouns.possessive} gaze. ${opponent.name} got free from ${character.name}'s Sorganeil.`,
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
    `Will fail if used before turn 5. Use the opponent's signature move at this card's empower level -2.`,
  emoji: CardEmoji.UBEL_CARD,
  effects: [],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    if (game.turnCount < 5) {
      return new Card({
        title: empathyFailureName,
        cardMetadata: { nature: Nature.Default },
        description: () => "Not enough time to empathize. This move will fail.",
        effects: [],
        emoji: CardEmoji.UBEL_CARD,
        cardAction: (_game, _characterIndex, messageCache: MessageCache) => {
          messageCache.push(
            `${game.getCharacter(characterIndex).name} didn't get enough time to know ${game.getCharacter(1 - characterIndex).name} well enough!`,
            TCGThread.Gameroom
          );
        },
        empathized: true,
      });
    } else {
      const opponent = game.getCharacter(1 - characterIndex);
      const signatureCard = signatureMoves[opponent.name];
      return new Card({
        ...signatureCard,
        empowerLevel: this.empowerLevel - 2,
        empathized: true,
      });
    }
  },
});

export const ubelDeck = [
  { card: a_reelseiden, count: 3 },
  { card: a_cleave, count: 2 },
  { card: a_dismantle, count: 2 },
  { card: a_malevolentShrine, count: 1 },
  { card: rushdown, count: 2 },
  { card: defend, count: 2 },
  { card: recompose, count: 2 },
  { card: sorganeil, count: 1 },
  { card: empathy, count: 1 },
];
