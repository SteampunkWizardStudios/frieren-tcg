export interface StatsProp {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  ability: number;
}

export const StatsEnum  ={
  HP: "HP",
  ATK: "ATK",
  DEF: "DEF",
  SPD: "SPD",
  Ability: "Ability",
} as const;
export type StatsEnum = typeof StatsEnum[keyof typeof StatsEnum];

export default class Stats {
  stats: Record<StatsEnum, number>;
  startingHp: number;

  constructor(stats: Record<StatsEnum, number>, startingHp?: number) {
    this.stats = stats;
    this.startingHp = startingHp ?? stats.HP;
  }

  clone(): Stats {
    return new Stats(
      {
        ...this.stats,
      },
      this.startingHp
    );
  }
}
