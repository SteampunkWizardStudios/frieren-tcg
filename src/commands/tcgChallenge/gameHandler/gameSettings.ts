export enum GameMode {
  CLASSIC = "classic",
  BLITZ = "blitz",
  SLOW = "slow",
}

export interface GameSettings {
  turnDurationSeconds: number;
  revealHand: boolean;
  revealDraw: boolean;
  publicChallengedThread?: boolean;
  optionName?: string;
  allowedOption?: boolean;
}

export const GAME_SETTINGS: Record<GameMode, GameSettings> = {
  [GameMode.CLASSIC]: {
    turnDurationSeconds: 45,
    revealHand: false,
    revealDraw: false,
    optionName: "Classic - 45s Turn Duration",
    allowedOption: true,
  },
  [GameMode.BLITZ]: {
    turnDurationSeconds: 10,
    revealHand: false,
    revealDraw: false,
    optionName: "Blitz - 10s Turn Duration",
    allowedOption: true,
  },
  [GameMode.SLOW]: {
    turnDurationSeconds: 120,
    revealHand: true,
    revealDraw: true,
    optionName: "Slow - 2m Turn Duration. Hands and Active Cards revealed",
    allowedOption: true,
  },
};
