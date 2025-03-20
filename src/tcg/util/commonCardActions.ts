import Game from "../game";
import { StatsEnum } from "../stats";

export default class CommonCardAction {
  // common attack function that returns whether the attack was successful or not
  static commonAttack(
    game: Game,
    characterIndex: number,
    damage: number,
    hpCost: number,
    isTimedEffectAttack: boolean,
  ): boolean {
    const character = game.getCharacter(characterIndex);
    if (hpCost === 0 || character.adjustStat(-hpCost, StatsEnum.HP)) {
      const actualDamage = game.attack({
        attackerIndex: characterIndex,
        damage,
        isTimedEffectAttack,
      });
      if (actualDamage > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
