import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";

export const FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID = "738445835234181211";

export const MAX_TEXT_SPEED = 3000;
export const DEFAULT_TEXT_SPEED = 1500;
export const MIN_TEXT_SPEED = 100;

export const CHAR_OPTIONS = Object.entries(VISIBLE_CHARACTERS)
  .filter(([, character]) => character.additionalMetadata.hidden !== true)
  .map(([, character]) => ({
    name: character.name,
    value: character.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
