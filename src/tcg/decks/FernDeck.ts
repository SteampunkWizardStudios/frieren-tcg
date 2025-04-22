import Card, { Nature } from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";
import { manaDetection, manaDetectionBaseCardAction } from "./LinieDeck";

export const a_fernZoltraak = new Card({
  title: "Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `HP-3. DMG ${dmg}. Gain 1 Barrage count.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [6],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} fired Zoltraak!`, TCGThread.Gameroom);

    const damage = this.calculateEffectValue(this.effects[0]);
    character.additionalMetadata.fernBarrage =
      (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 3 });
  },
});

export const a_fernBarrage = new Card({
  title: "Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-3. DMG ${dmg}. Gain 1 Barrage count. At the end of each turn, -1 Barrage count, HP-3, deal ${dmg} DMG, until Barrage count reaches 0.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [6],
  cosmetic: {
    cardGif: "https://c.tenor.com/2RAJbNpiLI4AAAAd/tenor.gif",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} initiated her barrage!`,
      TCGThread.Gameroom
    );

    const damage = this.calculateEffectValue(this.effects[0]);
    const newBarrageCount = (character.additionalMetadata.fernBarrage ?? 0) + 1;
    character.additionalMetadata.fernBarrage = newBarrageCount;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 3 });

    character.timedEffects.push(
      new TimedEffect({
        name: "Barrage",
        description: `HP-3. Deal ${damage} DMG.`,
        turnDuration: newBarrageCount,
        endOfTurnAction: function (
          this: TimedEffect,
          game,
          characterIndex,
          _messageCache
        ) {
          const character = game.getCharacter(characterIndex);
          character.additionalMetadata.fernBarrage ??= 0;

          if (character.additionalMetadata.fernBarrage > 0) {
            messageCache.push(
              `${character.name} puts on the pressure!`,
              TCGThread.Gameroom
            );
            character.additionalMetadata.fernBarrage -= 1;
            messageCache.push(
              `${character.name} lost 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
              TCGThread.Gameroom
            );
            CommonCardAction.commonAttack(game, characterIndex, {
              damage,
              hpCost: 3,
            });
          } else {
            messageCache.push(
              `${character.name} lets up ${character.cosmetic.pronouns.possessive} barrage.`,
              TCGThread.Gameroom
            );
          }

          this.turnDuration = character.additionalMetadata.fernBarrage;
        },
      })
    );
  },
});

const a_fernConcentratedZoltraakSnipe = new Card({
  title: "Concentrated Zoltraak Snipe",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-12, Barrage count +1. Afterwards, deal ${dmg} DMG x Barrage count. Reset Barrage count to 0.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [4],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} sniped at the opponent!`,
      TCGThread.Gameroom
    );

    const singleDamage = this.calculateEffectValue(this.effects[0]);
    const barrageCount = (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: singleDamage * barrageCount,
      hpCost: 12,
    });

    character.additionalMetadata.fernBarrage = 0;
    messageCache.push(
      `${character.name}'s barrage count is set to 0.`,
      TCGThread.Gameroom
    );
  },
});

const disapprovingPout = new Card({
  title: "Disapproving Pout",
  cardMetadata: { nature: Nature.Util },
  description: ([spd, oppAtkDecrease]) =>
    `SPD+${spd}. Opp's ATK-${oppAtkDecrease}. Gain 1 Barrage count.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [1, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} looks down on the opponent.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.SPD
    );
    opponent.adjustStat(
      -1 * this.calculateEffectValue(this.effects[1]),
      StatsEnum.ATK
    );

    character.additionalMetadata.fernBarrage =
      (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );
  },
});

export const manaConcealment = new Card({
  title: "Mana Concealment",
  cardMetadata: { nature: Nature.Util },
  description: ([atk]) =>
    `ATK+${atk}. Barrage count + 1. Receive Priority+1 on attacks for next turn.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conceals ${character.cosmetic.pronouns.possessive} presence.`,
      TCGThread.Gameroom
    );

    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.ATK
    );
    character.additionalMetadata.fernBarrage =
      (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );
    character.ability.abilitySelectedMoveModifierEffect = function (
      _game,
      _characterIndex,
      _messageCache,
      selectedCard
    ) {
      if (selectedCard.cardMetadata.nature === Nature.Attack) {
        selectedCard.priority = 1;
      }
    };

    character.timedEffects.push(
      new TimedEffect({
        name: "Mana Concealment",
        description: `Attacking moves receive Priority+1`,
        turnDuration: 2,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} unveiled ${character.cosmetic.pronouns.possessive} presence.`,
            TCGThread.Gameroom
          );
          character.ability.abilitySelectedMoveModifierEffect = undefined;
        },
      })
    );
  },
});

export const fernManaDetection = new Card({
  ...manaDetection,
  description: ([spd, bigNumber, smallNumber]) =>
    `SPD+${spd}. If Opp's DEF >= Opp's ATK, ATK+${bigNumber}, DEF+${smallNumber}. Otherwise, ATK+${smallNumber}, DEF+${bigNumber}. Reveal the opponent's highest empowered card. Gain 1 Barrage count.`,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    manaDetectionBaseCardAction.call(this, game, characterIndex, messageCache);

    const character = game.getCharacter(characterIndex);
    character.additionalMetadata.fernBarrage =
      (character.additionalMetadata.fernBarrage ?? 0) + 1;
    messageCache.push(
      `${character.name} gained 1 Barrage count. Current Barrage count: **${character.additionalMetadata.fernBarrage}**.`,
      TCGThread.Gameroom
    );
  },
});

export const spellToCreateManaButterflies = new Card({
  title: "Spell to Create Mana Butterflies",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 4 turn ends, heal ${endHp}. Reset Barrage count to 0.`,
  cosmetic: {
    cardGif: "https://c.tenor.com/B93aR7oWJ4IAAAAC/tenor.gif",
  },
  emoji: CardEmoji.FERN_CARD,
  effects: [6, 2],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} conjured a field of mana butterflies.`,
      TCGThread.Gameroom
    );

    const initialHealing = this.calculateEffectValue(this.effects[0]);
    const endOfTurnHealing = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(initialHealing, StatsEnum.HP);

    character.additionalMetadata.fernBarrage = 0;
    messageCache.push(
      `${character.name}'s Barrage count is set to 0.'`,
      TCGThread.Gameroom
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Field of Butterflies",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 4,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Mana Butterflies soothes ${character.name}.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Mana Butterflies fade.", TCGThread.Gameroom);
        },
      })
    );
  },
});

export const commonDefensiveMagic = new Card({
  title: "Common Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn. Reset Barrage count to 0.`,
  emoji: CardEmoji.FERN_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} put up a common defensive spell.`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.additionalMetadata.fernBarrage = 0;
    messageCache.push(
      `${character.name}'s Barrage count is set to 0.'`,
      TCGThread.Gameroom
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Common Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const fernDeck = [
  { card: a_fernZoltraak, count: 3 },
  { card: a_fernBarrage, count: 2 },
  { card: a_fernConcentratedZoltraakSnipe, count: 2 },
  { card: disapprovingPout, count: 2 },
  { card: manaConcealment, count: 2 },
  { card: fernManaDetection, count: 1 },
  { card: commonDefensiveMagic, count: 2 },
  { card: spellToCreateManaButterflies, count: 2 },
];
