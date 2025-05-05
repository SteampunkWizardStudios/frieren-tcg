import { Frieren } from "@character/Frieren";
import { Sense } from "@character/Sense";
import { Stille } from "@character/Stille";
import { Serie } from "@character/Serie";
import { Linie } from "@character/Linie";
import { Sein } from "@character/Sein";
import { Stark } from "@character/Stark";
import { Laufen } from "@character/Laufen";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { Denken } from "@character/Denken";
import { Himmel } from "@character/Himmel";
import { Ubel } from "@character/Ubel";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { Fern } from "@character/Fern";

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
