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
  pierceFactor: number;
  minimumPossibleHp?: number | undefined; // if undefined, there is no minimum hp cap
  overheal?: boolean;
  selectedCard?: Card;

  senseTeaTimeStacks?: number;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
  himmelEisenReadyToCounter?: boolean;
  ubelSureHit?: UbelHit;
  ubelSlashMovesPierceFactor?: number;
  fernBarrage?: number;
  forcedDiscards: number;

  hidden?: boolean;
  publicDiscards: boolean;
};
