export enum CharacterName {
  Frieren = "Frieren",
  Sense = "Sense",
  Stille = "Stille",
  Serie = "Serie",
  Linie = "Linie",
  Sein = "Sein",
  Stark = "Stark",
  Laufen = "Laufen",

  StoneGeisel = "Stone Geisel",
  FireGolem = "Fire Golem",
  StoneGolem = "Stone Golem",
  SpiegelSein = "Sein...?",
  SpiegelSerie = "Serie...?",
  SpiegelSense = "Sense...?",
  CosmicTon = "???",
}

export const CharactersWithNoAccessToDefaultOptions = new Set<CharacterName>([
  CharacterName.Stille,

  CharacterName.StoneGeisel,
  CharacterName.FireGolem,
  CharacterName.StoneGolem,
]);
