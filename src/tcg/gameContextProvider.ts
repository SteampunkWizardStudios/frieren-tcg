import Game from "@src/tcg/game";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { StatsEnum } from "@src/tcg/stats";
import Character from "@src/tcg/character";
import Card from "@src/tcg/card";
import CommonCardAction from "./util/commonCardActions";

export type GameContext = ReturnType<typeof gameContextProvider>;
export type GameMessageContext = ReturnType<typeof gameAndMessageContext>;

// adapted from Card.ts
const EMPOWER_BOOST = 0.1;

const calculateEffectValue = (baseValue: number, empowerLevel: number) => {
  return Number((baseValue * (1 + empowerLevel * EMPOWER_BOOST)).toFixed(2));
};

/**
 * Provides convenience methods and properties for cardActions.
 * @param {Card} this - A card instance
 * @param {Game} game - The game instance
 * @param {number} characterIndex - The index of the character using the card or effect
 * @returns The GameContext object with context-specific methods and properties for use in game actions
 */
export default function gameContextProvider(
  this: Card,
  game: Game,
  characterIndex: number
) {
  const self = game.getCharacter(characterIndex);
  const opponent = game.getCharacter(1 - characterIndex);

  const calcEffect = (effectIndex: number) => {
    return calculateEffectValue(this.effects[effectIndex], this.empowerLevel);
  };

  const changeStat = (
    target: Character,
    amount: number,
    stat: StatsEnum,
    multiplier: number = 1
  ) => {
    const change = amount * multiplier;
    target.adjustStat(change, stat);
    return change;
  };
  const changeStatWithEmpower = (
    target: Character,
    effectIndex: number,
    stat: StatsEnum,
    multiplier: number = 1
  ) => {
    const empowered = calculateEffectValue(
      this.effects[effectIndex],
      this.empowerLevel
    );
    const change = empowered * multiplier;
    target.adjustStat(change, stat);
    return change;
  };

  /**
   * Takes a given damage value and hp cost, and attacks with a flat number of damage
   * @param {number} damage - How much damage to deal
   * @param {number} hpCost - The amount of HP used for the attack
   */
  const flatAttack = (
    damage: number,
    hpCost: number,
    pierceFactor?: number
  ) => {
    return CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost,
      pierceFactor,
    });
  };

  /**
   * Takes a given effect index and hp cost, and uses empowered damage for the attack
   * @param {number} effectIndex - The index of the effect to use for the damage
   * @param {number} hpCost - The amount of HP used for the attack
   */
  const basicAttack = (
    effectIndex: number,
    hpCost: number,
    pierceFactor?: number
  ) => {
    const damage = calculateEffectValue(
      this.effects[effectIndex],
      this.empowerLevel
    );
    flatAttack(damage, hpCost, pierceFactor);
    return damage;
  };

  /**
   * Adjusts self's stats by a given amount
   * @param {number} amount - The amount to adjust the stat by
   * @param {StatsEnum} stat - The stat to adjust
   */
  const flatSelfStat = changeStat.bind(null, self);
  /**
   * Takes a given effect index and stat, and adjusts self's stats by the empowered value of that effect
   * @param {number} effectIndex - The index of the effect to use for the adjustment
   * @param {StatsEnum} stat - The stat to adjust
   */
  const selfStat = changeStatWithEmpower.bind(null, self);
  /**
   * Adjusts opponent's stats by a given amount
   * @param {number} amount - The amount to adjust the stat by
   * @param {StatsEnum} stat - The stat to adjust
   */
  const flatOpponentStat = changeStat.bind(null, opponent);
  /**
   * Takes a given effect index and stat, and adjusts opponent's stats by the empowered value of that effect
   * @param {number} effectIndex - The index of the effect to use for the adjustment
   * @param {StatsEnum} stat - The stat to adjust
   * @param {number} multiplier - The multiplier to apply to the effect value, you'll want to use -1 for a debuff
   */
  const opponentStat = changeStatWithEmpower.bind(null, opponent);

  return {
    // self properties
    self,
    selfIndex: characterIndex,
    selfStats: self.stats.stats,
    name: self.name,
    reflexive: self.cosmetic.pronouns.reflexive,
    possessive: self.cosmetic.pronouns.possessive,

    // self stat
    selfStat,
    flatSelfStat,

    // attacks
    basicAttack,
    flatAttack,

    // self misc
    calcEffect,

    // opponent properties
    opponent,
    opponentStats: opponent.stats.stats,

    // opponent stat
    opponentStat,
    flatOpponentStat,

    // game
    game,
  };
}

function messageContext(messageCache: MessageCache) {
  const sendToGameroom = (message: string) => {
    messageCache.push(message, TCGThread.Gameroom);
  };

  return {
    // thread messaging
    sendToGameroom,
    messageCache,
  };
}

export function gameAndMessageContext(
  this: Card,
  game: Game,
  messageCache: MessageCache,
  characterIndex: number
) {
  return {
    ...gameContextProvider.call(this, game, characterIndex),
    ...messageContext(messageCache),
  };
}
