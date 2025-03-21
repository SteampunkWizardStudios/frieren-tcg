import Card from "./card";
import Character from "./character";
import { GameAdditionalMetadata } from "./additionalMetadata/gameAdditionalMetadata";
import { MessageCache } from "../tcgChatInteractions/messageCache";
import { TCGThread } from "../tcgChatInteractions/sendGameMessage";

export default class Game {
  characters: [Character, Character];
  turnCount: number;
  gameOver: boolean;
  additionalMetadata: GameAdditionalMetadata;

  messageCache: MessageCache;

  constructor(characters: [Character, Character], messageCache: MessageCache) {
    this.characters = characters;
    this.gameOver = false;
    this.additionalMetadata = {
      attackMissed: {
        0: false,
        1: false,
      },
      attackModifier: {
        0: 1,
        1: 1,
      },
      currentDraws: {},
      lastUsedCards: {},
    };
    this.turnCount = 0;

    this.messageCache = messageCache;
  }

  gameStart() {
    this.characters.forEach((character) => character.drawStartingHand());
  }

  // handle character attack. returns attack amount
  attack(attackProps: {
    attackerIndex: number;
    damage: number;
    isTimedEffectAttack: boolean;
  }): number {
    const attacker = this.getCharacter(attackProps.attackerIndex);
    const defender = this.getCharacter(1 - attackProps.attackerIndex);
    if (attackProps.isTimedEffectAttack) {
      attacker.additionalMetadata.timedEffectAttackedThisTurn = true;
    } else {
      attacker.additionalMetadata.attackedThisTurn = true;
    }

    // handle attacker/defender ability
    if (attacker.ability.abilityAttackEffect) {
      attacker.ability.abilityAttackEffect(
        this,
        attackProps.attackerIndex,
        this.messageCache,
      );
    }
    if (defender.ability.abilityDefendEffect) {
      defender.ability.abilityDefendEffect(
        this,
        1 - attackProps.attackerIndex,
        this.messageCache,
        attackProps.damage,
      );
    }

    if (this.additionalMetadata.attackMissed[attackProps.attackerIndex]) {
      this.messageCache.push(`# ${attacker.name} missed!`, TCGThread.Gameroom);
      this.additionalMetadata.attackMissed[attackProps.attackerIndex] = false;
      return 0;
    } else {
      const actualDamage = this.calculateDamage(
        attackProps.damage *
          this.additionalMetadata.attackModifier[attackProps.attackerIndex],
        attacker.stats.stats.ATK,
        defender.stats.stats.DEF,
      );

      defender.stats.stats.HP = Number(
        (defender.stats.stats.HP - actualDamage).toFixed(2),
      );
      const hpLeft: string = defender.additionalMetadata.manaSuppressed
        ? ""
        : `${defender.name} has ${defender.stats.stats.HP} left!`;
      this.messageCache.push(
        `# ${attacker.name} attacks ${defender.name} for ${actualDamage.toFixed(2)} damage! ${hpLeft}`,
        TCGThread.Gameroom,
      );

      if (attackProps.isTimedEffectAttack) {
        if (attacker.ability.abilityAfterTimedAttackEffect) {
          attacker.ability.abilityAfterTimedAttackEffect(
            this,
            attackProps.attackerIndex,
            this.messageCache,
          );
        }
      } else {
        if (attacker.ability.abilityAfterDirectAttackEffect) {
          attacker.ability.abilityAfterDirectAttackEffect(
            this,
            attackProps.attackerIndex,
            this.messageCache,
          );
        }
      }

      return actualDamage;
    }
  }

  // check to see which character should move first
  getFirstMove(characterToMoveMap: Record<number, Card>): number {
    if (!(0 in characterToMoveMap)) {
      return 1;
    }
    if (!(1 in characterToMoveMap)) {
      return 0;
    }

    if (characterToMoveMap[0].priority > characterToMoveMap[1].priority) {
      return 0;
    } else if (
      characterToMoveMap[1].priority > characterToMoveMap[0].priority
    ) {
      return 1;
    } else {
      if (
        this.characters[0].stats.stats.SPD > this.characters[1].stats.stats.SPD
      ) {
        return 0;
      } else if (
        this.characters[1].stats.stats.SPD > this.characters[0].stats.stats.SPD
      ) {
        return 1;
      } else {
        return Math.floor(Math.random() * 2);
      }
    }
  }

  getCharacter(characterIndex: number): Character {
    if (characterIndex != 0 && characterIndex != 1) {
      throw new Error("characterIndex must be 0 or 1");
    }

    return this.characters[characterIndex];
  }

  checkGameOver(): number {
    let losingIndex = 0;
    this.characters.forEach((character, index) => {
      if (!this.gameOver) {
        if (character.stats.stats.HP <= 0) {
          this.messageCache.push(
            `# ${character.name} has been defeated!`,
            TCGThread.Gameroom,
          );
          this.gameOver = true;

          losingIndex = index;
          return;
        }
      }
    });

    return losingIndex;
  }

  private calculateDamage(
    moveDamage: number,
    attackerAttack: number,
    defenderDefense: number,
  ) {
    return Math.max(1, moveDamage + attackerAttack - defenderDefense);
  }
}
