import type Game from "@tcg/game";
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
  // more hooks here
}
