import { Frieren } from "./characterData/characters/Frieren";
import { Sense } from "./characterData/characters/Sense";
import { Stille } from "./characterData/characters/Stille";
import { Serie } from "./characterData/characters/Serie";
import { Linie } from "./characterData/characters/Linie";
import { Sein } from "./characterData/characters/Sein";
import { Stark } from "./characterData/characters/Stark";
import { Laufen } from "./characterData/characters/Laufen";
import { CharacterData } from "./characterData/characterData";

const ALLOWLISTED_USER_IDS = new Set([
  "139757382375833600", // Hexa
  "391002488737628161", // Dodo
  "1206295979918106705", // Steam
]);

export const CHARACTER_LIST: CharacterData[] = [
  Frieren,
  Sense,
  Stille,
  Serie,
  Linie,
  Sein,
  Stark,
  Laufen,
];

//   if (ALLOWLISTED_USER_IDS.has(user.id)) {
//     return fullCharacterList;
//   } else {
//     if (characterSelectState.isSeinSerieEnabled) {
//       return fullCharacterList.slice(0, 3);
//     } else {
//       return fullCharacterList.slice(0, 2); // only Serie/Sein
//     }
//   }
