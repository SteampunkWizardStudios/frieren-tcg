export interface CharacterAdditionalMetadataProps {
  manaSuppressed: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  teaTimeStacks?: number;
  overheal?: boolean;
}

export type CharacterAdditionalMetadata = {
  manaSuppressed: boolean;
  attackedThisTurn: boolean;
  timedEffectAttackedThisTurn: boolean;
  teaTimeStacks?: number;
  overheal?: boolean;
  serieToyingNextTurn?: boolean;
  serieToyingTurn?: boolean;
};
