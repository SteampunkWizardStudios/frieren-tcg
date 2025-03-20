import Card from "./card";
import Game from "./game";

export interface AbilityProps {
  abilityName: string;
  abilityEffectString: string;
  abilityAttackEffect?: (game: Game, characterIndex: number) => void;
  abilityDefendEffect?: (game: Game, characterIndex: number) => void;
  abilityEndOfTurnEffect?: (game: Game, characterIndex: number) => void;
}

export type Ability = {
  abilityName: string;
  abilityEffectString: string;
  abilityOnCardUse?: (game: Game, characterIndex: number, card: Card) => void;
  abilityAttackEffect?: (game: Game, characterIndex: number) => void;
  abilityAfterDirectAttackEffect?: (game: Game, characterIndex: number) => void;
  abilityAfterTimedAttackEffect?: (game: Game, characterIndex: number) => void;
  abilityDefendEffect?: (
    game: Game,
    characterIndex: number,
    attackDamage: number,
  ) => void;
  abilityEndOfTurnEffect?: (
    game: Game,
    characterIndex: number,
    additionalParam?: Record<any, any>,
  ) => void;
};
