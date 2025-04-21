/* export interface CharacterAdditionalMetadataProps {
  manaSuppressed: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  teaTimeStacks?: number;
  overheal?: boolean;
} */

export enum UbelHit {
  SureHit = "sureHit",
  SureMiss = "sureMiss",
  Regular = "regular",
}

export type CharacterAdditionalMetadata = {
  manaSuppressed: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  accessToDefaultCardOptions: boolean;
  teaTimeStacks?: number;
  overheal?: boolean;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  pierceFactor?: number;
  sureHit?: UbelHit;
};
