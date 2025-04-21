import { CharacterName } from "../../characters/metadata/CharacterName";
import Card, { Nature } from "../../card";
import { ordinaryDefensiveMagic } from "../FrierenDeck";
import { basicDefensiveMagic } from "../SerieDeck";
import { elementaryDefensiveMagic } from "../DenkenDeck";
import { quickBlock } from "../HimmelDeck";
import { parry } from "../LaufenDeck";
import { braceYourself } from "../SeinDeck";
import { hairBarrier } from "../SenseDeck";
import { block } from "../StarkDeck";
import { deflect } from "../StilleDeck";

export const defenseMoves: Record<CharacterName, Card> = {
  [CharacterName.Frieren]: ordinaryDefensiveMagic,
  [CharacterName.Serie]: basicDefensiveMagic,
  [CharacterName.Denken]: elementaryDefensiveMagic,
  [CharacterName.Laufen]: parry,
  [CharacterName.Linie]: parry,
  [CharacterName.Stark]: block,
  [CharacterName.Himmel]: quickBlock,
  [CharacterName.Stille]: deflect,
  [CharacterName.Sein]: braceYourself,
  [CharacterName.Sense]: hairBarrier,
  [CharacterName.Ubel]: basicDefensiveMagic, //Change this later
} as const;
