import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import Card from "@tcg/card";
import { a_catastraviaBase } from "@decks/DenkenDeck";
import { a_theHeightOfMagic } from "@decks/FrierenDeck";
import { a_realHeroSwing } from "@decks/HimmelDeck";
import { jilwer } from "@decks/LaufenDeck";
import { imitate } from "@decks/LinieDeck";
import { a_threeSpearsOfTheGoddess } from "@decks/SeinDeck";
import { a_piercingDrill } from "@decks/SenseDeck";
import { ancientBarrierMagic } from "./serieSignature";
import { a_lightningStrike } from "@decks/StarkDeck";
import { a_geisel } from "@decks/StilleDeck";
import { a_malevolentShrine } from "./ubelSignature";
import { spellToCreateManaButterflies } from "@decks/FernDeck";

export const signatureMoves: Record<CharacterName, Card> = {
  [CharacterName.Denken]: a_catastraviaBase,
  [CharacterName.Frieren]: a_theHeightOfMagic,
  [CharacterName.Himmel]: a_realHeroSwing,
  [CharacterName.Laufen]: jilwer,
  [CharacterName.Linie]: imitate,
  [CharacterName.Sein]: a_threeSpearsOfTheGoddess,
  [CharacterName.Sense]: a_piercingDrill,
  [CharacterName.Serie]: ancientBarrierMagic,
  [CharacterName.Stark]: a_lightningStrike,
  [CharacterName.Stille]: a_geisel,
  [CharacterName.Ubel]: a_malevolentShrine,
  [CharacterName.Fern]: spellToCreateManaButterflies,
};

export const SIGNATURE_MOVES_LIST = Object.entries(signatureMoves);
