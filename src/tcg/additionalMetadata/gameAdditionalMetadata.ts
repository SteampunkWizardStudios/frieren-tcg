import Card from "@tcg/card";

export enum FlammeTheory {
  Irreversibility = "Irreversibility",
  Balance = "Balance",
  Prescience = "Prescience",
  Soul = "Soul",
}

export type GameAdditionalMetadata = {
  attackMissed: Record<number, boolean>;
  attackCountered: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentDraws: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
  forfeited: Record<number, boolean>;
  flammeTheory: Record<FlammeTheory, boolean>;
};
