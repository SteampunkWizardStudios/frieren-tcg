export interface StatsProp {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  ability: number;
}

export enum StatsEnum {
  HP = "HP",
  ATK = "ATK",
  DEF = "DEF",
  SPD = "SPD",
  Ability = "Ability",
}

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
