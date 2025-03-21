export enum GameMode {
  CLASSIC = "classic",
  BLITZ = "blitz",
  SLOW = "slow",
  PVE = "pve",
}

export interface GameSettings {
  turnDurationSeconds: number;
  revealHand: boolean;
  revealDraw: boolean;
  publicChallengedThread?: boolean;
}

export const GAME_SETTINGS: Record<GameMode, GameSettings> = {
  [GameMode.CLASSIC]: {
    turnDurationSeconds: 45,
    revealHand: false,
    revealDraw: false,
  },
  [GameMode.BLITZ]: {
    turnDurationSeconds: 10,
    revealHand: false,
    revealDraw: false,
  },
  [GameMode.SLOW]: {
    turnDurationSeconds: 120,
    revealHand: true,
    revealDraw: true,
  },
  [GameMode.PVE]: {
    turnDurationSeconds: 120,
    revealHand: false,
    revealDraw: false,
    publicChallengedThread: true,
  },
};
