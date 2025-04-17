export const CharacterName = {
  Frieren:  "Frieren",
  Sense: "Sense",
  Stille: "Stille",
  Serie:  "Serie",
  Linie:  "Linie",
  Sein:  "Sein",
  Stark:  "Stark",
  Laufen:  "Laufen",
  Denken:  "Denken",
  Himmel:  "Himmel",
} as const;
export type CharacterName = typeof CharacterName[keyof typeof CharacterName];