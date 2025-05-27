export interface StatsProp {
  health: number;
  attack: number;
  defense: number;
  truedef?: number;
  speed: number;
  ability: number;
}

export enum StatsEnum {
  HP = "HP",
  ATK = "ATK",
  DEF = "DEF",
  TrueDEF = "TrueDEF",
  SPD = "SPD",
  Ability = "Ability",
}

export default class Stats {
  stats: Record<StatsEnum, number>;
  startingHp: number;

  constructor(stats: Record<StatsEnum, number>, startingHp?: number) {
    this.stats = {
      ...stats,
      [StatsEnum.TrueDEF]: stats[StatsEnum.TrueDEF] ?? 0,
    };
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
