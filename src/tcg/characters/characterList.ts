import { Frieren } from "./characterData/characters/Frieren";
import { Sense } from "./characterData/characters/Sense";
import { Stille } from "./characterData/characters/Stille";
import { Serie } from "./characterData/characters/Serie";
import { Linie } from "./characterData/characters/Linie";
import { Sein } from "./characterData/characters/Sein";
import { Stark } from "./characterData/characters/Stark";
import { Laufen } from "./characterData/characters/Laufen";
import { CharacterData } from "./characterData/characterData";
import { Denken } from "./characterData/characters/Denken";
import { Himmel } from "./characterData/characters/Himmel";
import { Ubel } from "./characterData/characters/Ubel";
import { CharacterName } from "./metadata/CharacterName";
import { Fern } from "./characterData/characters/Fern";

export const CHARACTER_MAP: Record<CharacterName, CharacterData> = {
  [CharacterName.Frieren]: Frieren,
  [CharacterName.Sense]: Sense,
  [CharacterName.Stille]: Stille,
  [CharacterName.Serie]: Serie,
  [CharacterName.Linie]: Linie,
  [CharacterName.Sein]: Sein,
  [CharacterName.Stark]: Stark,
  [CharacterName.Laufen]: Laufen,
  [CharacterName.Denken]: Denken,
  [CharacterName.Himmel]: Himmel,
  [CharacterName.Ubel]: Ubel,
  [CharacterName.Fern]: Fern,
} as const;

export const CHARACTER_LIST: CharacterData[] = Object.values(CHARACTER_MAP);
