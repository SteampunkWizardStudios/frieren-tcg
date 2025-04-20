import Pronouns from "../../pronoun";
import { CharacterName } from "../metadata/CharacterName";
import { Ability } from "../../ability";
import Stats from "../../stats";
import Card, { Nature } from "../../card";
import { CharacterAdditionalMetadata } from "../../additionalMetadata/characterAdditionalMetadata";
import { CharacterEmoji } from "../../formatting/emojis";

export interface CharacterCosmetic {
  pronouns: Pronouns;
  emoji: CharacterEmoji;
  color: number;
  imageUrl: string;
}

export interface CharacterDataProps {
  name: CharacterName;
  cosmetic: CharacterCosmetic;
  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;
  additionalMetadata: CharacterAdditionalMetadata;
}

export class CharacterData {
  name: CharacterName;
  cosmetic: CharacterCosmetic;
  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;

  additionalMetadata: CharacterAdditionalMetadata;

  constructor(characterDataProps: CharacterDataProps) {
    this.name = characterDataProps.name;
    this.cosmetic = characterDataProps.cosmetic;
    this.stats = characterDataProps.stats;
    this.cards = characterDataProps.cards;
    this.ability = characterDataProps.ability;
    this.additionalMetadata = characterDataProps.additionalMetadata;
  }

  clone(): CharacterData {
    return new CharacterData({
      name: this.name,
      cosmetic: this.cosmetic,
      stats: this.stats.clone(),
      cards: this.cards,
      ability: { ...this.ability },
      additionalMetadata: { ...this.additionalMetadata },
    });
  }
}
