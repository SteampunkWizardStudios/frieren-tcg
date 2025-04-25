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
  minimumPossibleHp?: number | undefined; // if undefined, there is no minimum hp cap
  pierceFactor?: number;
  overheal?: boolean;

  senseTeaTimeStacks?: number;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  himmelEisenReadyToCounter?: boolean;
  ubelSureHit?: UbelHit;
  fernBarrage?: number;
};
