export enum UbelHit {
  SureHit = "sureHit",
  SureMiss = "sureMiss",
  Regular = "regular",
}

export type CharacterAdditionalMetadata = {
  manaSuppressed: boolean;
  ignoreManaSuppressed: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  accessToDefaultCardOptions: boolean;
  defenseDamageReduction: number;
  teaTimeStacks?: number;
  overheal?: boolean;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  pierceFactor?: number;
  sureHit?: UbelHit;
  himmelEisenReadyToCounter?: boolean;
};
