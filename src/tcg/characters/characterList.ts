import { Frieren } from "./characterData/characters/Frieren";
import { Sense } from "./characterData/characters/Sense";
import { Stille } from "./characterData/characters/Stille";
import { createSerie } from "./characterData/characters/Serie";
import { Linie } from "./characterData/characters/Linie";
import { createSein } from "./characterData/characters/Sein";
import { Stark } from "./characterData/characters/Stark";
import { Laufen } from "./characterData/characters/Laufen";
import { CharacterData } from "./characterData/characterData";

export function createCharacterList(): CharacterData[] {
  return [
    Frieren,
    Sense,
    Stille,
    createSerie(),
    Linie,
    createSein(),
    Stark,
    Laufen,
  ];
}

// export const characterList: CharacterData[] = [
//   Frieren,
//   Sense,
//   Stille,
//   Serie,
//   Linie,
//   Sein,
//   Stark,
//   Laufen,
// ];
