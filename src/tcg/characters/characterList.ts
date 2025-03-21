import { Frieren } from "./characterData/characters/Frieren";
import { Sense } from "./characterData/characters/Sense";
import { Stille } from "./characterData/characters/Stille";
import { createSerie } from "./characterData/characters/Serie";
import { Linie } from "./characterData/characters/Linie";
import { createSein } from "./characterData/characters/Sein";
import { Stark } from "./characterData/characters/Stark";
import { Laufen } from "./characterData/characters/Laufen";
import { CharacterData } from "./characterData/characterData";
import { User } from "discord.js";
import { StoneGeisel } from "./characterData/characters/dungeonMonsters/StoneGeisel";
import { FireGolem } from "./characterData/characters/dungeonMonsters/FireGolem";
import { StoneGolem } from "./characterData/characters/dungeonMonsters/StoneGolem";
import { SpiegelSein } from "./characterData/characters/dungeonMonsters/SpiegelSein";
import { SpiegelSerie } from "./characterData/characters/dungeonMonsters/SpiegelSerie";
import { SpiegelSense } from "./characterData/characters/dungeonMonsters/SpiegelSense";
import { CosmicTon } from "./characterData/characters/dungeonMonsters/CosmicTon";

const ALLOWLISTED_USER_IDS = new Set([
  "139757382375833600", // Hexa
  "391002488737628161", // Dodo
  "1206295979918106705", // Steam
]);

export function createCharacterList(user: User): CharacterData[] {
  const fullCharacterList = [
    createSerie(),
    createSein(),
    Frieren,
    Sense,
    Stille,
    Linie,
    Stark,
    Laufen,

    StoneGeisel,
    FireGolem,
    StoneGolem,
    // AngryMimic
    SpiegelSein,
    SpiegelSerie,
    SpiegelSense,
    // ShadowDragon
    CosmicTon,
  ];

  if (ALLOWLISTED_USER_IDS.has(user.id)) {
    return fullCharacterList;
  } else {
    return fullCharacterList.slice(0, 2); // only Serie/Sein
  }
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
