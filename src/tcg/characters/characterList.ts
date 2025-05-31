import { CharacterData } from "@tcg/characters/characterData/characterData";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Denken from "@characters/Denken";
import Edel from "@characters/Edel";
import Fern from "@characters/Fern";
import Frieren from "@characters/Frieren";
import Himmel from "@characters/Himmel";
import Laufen from "@characters/Laufen";
import Linie from "@characters/Linie";
import Sein from "@characters/Sein";
import Sense from "@characters/Sense";
import Serie from "@characters/Serie";
import Stark from "@characters/Stark";
import Stille from "@characters/Stille";
import Ubel from "@characters/Ubel";
import Wirbel from "@characters/Wirbel";
import Flamme from "@characters/Flamme";

export const CHARACTER_MAP: Record<CharacterName, CharacterData> = {
  [CharacterName.Denken]: Denken,
  [CharacterName.Edel]: Edel,
  [CharacterName.Fern]: Fern,
  [CharacterName.Frieren]: Frieren,
  [CharacterName.Himmel]: Himmel,
  [CharacterName.Laufen]: Laufen,
  [CharacterName.Linie]: Linie,
  [CharacterName.Sein]: Sein,
  [CharacterName.Sense]: Sense,
  [CharacterName.Serie]: Serie,
  [CharacterName.Stark]: Stark,
  [CharacterName.Stille]: Stille,
  [CharacterName.Ubel]: Ubel,
  [CharacterName.Wirbel]: Wirbel,
  [CharacterName.Flamme]: Flamme,
} as const;

export const CHARACTER_LIST: CharacterData[] = Object.values(CHARACTER_MAP);
export const VISIBLE_CHARACTERS = CHARACTER_LIST.filter(
  (char) => char.additionalMetadata.hidden !== true
);
