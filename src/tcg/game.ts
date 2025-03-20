import Card from "./card";
import Character from "./character";
import { GameAdditionalMetadata } from "./additionalMetadata/gameAdditionalMetadata";

export default class Game {
  characters: [Character, Character];
  turnCount: number;
  gameOver: boolean;
  additionalMetadata: GameAdditionalMetadata;

  constructor(characters: [Character, Character]) {
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
      attacker.ability.abilityAttackEffect(this, attackProps.attackerIndex);
    }
    if (defender.ability.abilityDefendEffect) {
      defender.ability.abilityDefendEffect(
        this,
        1 - attackProps.attackerIndex,
        attackProps.damage,
      );
    }

    if (this.additionalMetadata.attackMissed[attackProps.attackerIndex]) {
      console.log(`# ${attacker.name} missed!`);
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
      console.log(
        `# ${attacker.name} attacks ${defender.name} for ${actualDamage.toFixed(2)} damage! ${hpLeft}`,
      );

      if (attackProps.isTimedEffectAttack) {
        if (attacker.ability.abilityAfterTimedAttackEffect) {
          attacker.ability.abilityAfterTimedAttackEffect(
            this,
            attackProps.attackerIndex,
          );
        }
      } else {
        if (attacker.ability.abilityAfterDirectAttackEffect) {
          attacker.ability.abilityAfterDirectAttackEffect(
            this,
            attackProps.attackerIndex,
          );
        }
      }

      return actualDamage;
    }
  }

  // check to see if game is over
  isGameOver(): boolean {
    this.characters.forEach((character) => {
      if (character.stats.stats.HP <= 0) {
        console.log(`# ${character.name} has been defeated!`);
        this.gameOver = true;
      }
    });

    return this.gameOver;
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

  private calculateDamage(
    moveDamage: number,
    attackerAttack: number,
    defenderDefense: number,
  ) {
    return Math.max(1, moveDamage + attackerAttack - defenderDefense);
  }
}
