import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Card from "@tcg/card";
import { ordinaryDefensiveMagic } from "@decks/FrierenDeck";
import { basicDefensiveMagic } from "@decks/SerieDeck";
import { bareHandedBlock, elementaryDefensiveMagic } from "@decks/DenkenDeck";
import { quickBlock } from "@decks/HimmelDeck";
import { parry } from "@decks/LaufenDeck";
import { braceYourself } from "@decks/SeinDeck";
import { hairBarrier } from "@decks/SenseDeck";
import { block } from "@decks/StarkDeck";
import { deflect } from "@decks/StilleDeck";
import { defend } from "@decks/UbelDeck";
import { commonDefensiveMagic } from "@decks/FernDeck";

export const defenseMoves: Record<CharacterName, Card[]> = {
  [CharacterName.Frieren]: [ordinaryDefensiveMagic],
  [CharacterName.Serie]: [basicDefensiveMagic],
  [CharacterName.Denken]: [elementaryDefensiveMagic, bareHandedBlock],
  [CharacterName.Laufen]: [parry],
  [CharacterName.Linie]: [parry],
  [CharacterName.Stark]: [block],
  [CharacterName.Himmel]: [quickBlock],
  [CharacterName.Stille]: [deflect],
  [CharacterName.Sein]: [braceYourself],
  [CharacterName.Sense]: [hairBarrier],
  [CharacterName.Ubel]: [defend],
  [CharacterName.Fern]: [commonDefensiveMagic],
} as const;
