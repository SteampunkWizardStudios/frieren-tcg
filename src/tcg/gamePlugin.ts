import type Game from "./game";
export interface GamePlugin {
  name: string;

  modifyInitialStats?(game: Game): void;
  onGameStart?(game: Game): void;
  modifyDamage?(
    game: Game,
    damage: number,
    attackerIndex: number,
    defenderIndex: number
  ): number;
  onAttackComplete?(
    game: Game,
    attackerIndex: number,
    actualDamage: number
  ): void;
  modifyCardDraw?(
    game: Game,
    characterIndex: number,
    baseDrawCount: number
  ): number;
  onCharacterDefeated?(game: Game, defeatedIndex: number): void;
  onTurnStart?(game: Game, turn: number): void;
}
