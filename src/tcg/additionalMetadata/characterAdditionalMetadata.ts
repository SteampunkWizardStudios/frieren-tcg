import Card from "@tcg/card";

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
  defenderDamageScaling: number;
  minimumPossibleHp?: number | undefined; // if undefined, there is no minimum hp cap
  pierceFactor?: number;
  overheal?: boolean;
  selectedCard?: Card
  discardsThisGame?: number;

  senseTeaTimeStacks?: number;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  himmelEisenReadyToCounter?: boolean;
  ubelSureHit?: UbelHit;
  ubelSlashMovesPierceFactor?: number;
  fernBarrage?: number;
};
