import { Frieren } from "@characters/Frieren";
import { Sense } from "@characters/Sense";
import { Stille } from "@characters/Stille";
import { Serie } from "@characters/Serie";
import { Linie } from "@characters/Linie";
import { Sein } from "@characters/Sein";
import { Stark } from "@characters/Stark";
import { Laufen } from "@characters/Laufen";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { Denken } from "@characters/Denken";
import { Himmel } from "@characters/Himmel";
import { Ubel } from "@characters/Ubel";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { Fern } from "@characters/Fern";

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
