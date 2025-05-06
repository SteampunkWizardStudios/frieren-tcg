import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Card from "@tcg/card";
import { a_catastraviaBase } from "@decks/DenkenDeck";
import { spellToCreateManaButterflies } from "@decks/FernDeck";
import { a_theHeightOfMagic } from "@decks/FrierenDeck";
import { a_realHeroSwing } from "@decks/HimmelDeck";
import { jilwer } from "@decks/LaufenDeck";
import { imitate } from "@decks/LinieDeck";
import { a_threeSpearsOfTheGoddess } from "@decks/SeinDeck";
import { a_piercingDrill } from "@decks/SenseDeck";
import { ancientBarrierMagic } from "./serieSignature";
import { a_geisel } from "@decks/StilleDeck";
import { a_lightningStrike } from "@decks/StarkDeck";
import { a_malevolentShrine } from "./ubelSignature";

export const signatureMoves: Record<CharacterName, Card> = {
  [CharacterName.Denken]: a_catastraviaBase,
  [CharacterName.Fern]: spellToCreateManaButterflies,
  [CharacterName.Frieren]: a_theHeightOfMagic,
  [CharacterName.Himmel]: a_realHeroSwing,
  [CharacterName.Laufen]: jilwer,
  [CharacterName.Linie]: imitate,
  [CharacterName.Sein]: a_threeSpearsOfTheGoddess,
  [CharacterName.Sense]: a_piercingDrill,
  [CharacterName.Stark]: a_lightningStrike,
  [CharacterName.Stille]: a_geisel,
  [CharacterName.Serie]: ancientBarrierMagic,
  [CharacterName.Ubel]: a_malevolentShrine,
};

export const SIGNATURE_MOVES_LIST = Object.entries(signatureMoves);
