import Card from "../card";

export interface GameAdditionalMetadataProps {
  attackMissed: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentDraws: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
}

export type GameAdditionalMetadata = {
  attackMissed: Record<number, boolean>;
  attackModifier: Record<number, number>;
  currentDraws: Record<number, Record<string, Card>>;
  lastUsedCards: Record<number, Card>;
};
