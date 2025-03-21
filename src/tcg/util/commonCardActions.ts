import Game from "../game";
import { StatsEnum } from "../stats";

export default class CommonCardAction {
  // common attack function that returns whether the attack was successful or not
  static commonAttack(
    game: Game,
    characterIndex: number,
    option: {
      damage: number,
      hpCost: number,
      isTimedEffectAttack?: boolean,
    }
  ): boolean {
    const isTimedEffectAttack = option.isTimedEffectAttack ?? false;
    const character = game.getCharacter(characterIndex);
    if (option.hpCost === 0 || character.adjustStat(-(option.hpCost), StatsEnum.HP)) {
      const actualDamage = game.attack({
        attackerIndex: characterIndex,
        damage: option.damage,
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
