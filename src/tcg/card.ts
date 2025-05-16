import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CardEmoji } from "@tcg/formatting/emojis";
import Game from "@tcg/game";
import { GameMessageContext } from "@tcg/gameContextProvider";

export interface CardCosmetic {
  cardImageUrl?: string;
  cardGif?: string;
}

export enum Nature {
  Attack = "Attack",
  Defense = "Defense",
  Default = "Default",
  Util = "Util",
}

type CardMetadata = {
  nature: Nature;
  seriePool?: "Common" | "Rare" | "Ultra-rare";
  signature?: boolean;
  analysis?: number;
  postAnalysis?: number;
  waldgoseDamage?: number;
  
  heiter?: boolean;
  eisen?: boolean;
  frieren?: boolean;

  teaTime?: number;
  resolve?: number;
  signatureMoveOf?: CharacterName;
  ubelFailureRate?: number;
};

export type CardProps = {
  title: string;
  cardMetadata: CardMetadata;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji?: CardEmoji;
  cosmetic?: CardCosmetic;
  cardAction: (context: GameMessageContext) => void;
  // TODO: change to a GameContext arg
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel?: number;
  priority?: number;
  imitated?: boolean;
  /**
   * @deprecated Use {@link Card.cardMetadata} instead
   */
  tags?: Record<string, number>;
  printEmpower?: boolean;
  hpCost?: number;
  empathized?: boolean;
};

export default class Card implements CardProps {
  readonly EMPOWER_BOOST = 0.1;

  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji: CardEmoji;
  cosmetic?: CardCosmetic | undefined;
  cardAction: (context: GameMessageContext) => void;
  // TODO: change to a GameContext arg
  conditionalTreatAsEffect?: (game: Game, characterIndex: number) => Card;
  empowerLevel: number;
  priority: number;
  imitated: boolean;
  tags: Record<string, number>;
  cardMetadata: CardMetadata;
  printEmpower: boolean;
  hpCost: number;
  empathized: boolean;

  constructor(cardProps: CardProps) {
    this.title = cardProps.title;
    this.description = cardProps.description;
    this.effects = cardProps.effects;
    this.cardAction = cardProps.cardAction;
    this.conditionalTreatAsEffect = cardProps.conditionalTreatAsEffect;
    this.empowerLevel = cardProps.empowerLevel ?? 0;
    this.priority = cardProps.priority ?? 0;
    this.imitated = cardProps.imitated ?? false;
    this.tags = cardProps.tags ?? {};
    this.cardMetadata = cardProps.cardMetadata;
    this.emoji = cardProps.emoji ?? CardEmoji.GENERIC;
    this.cosmetic = cardProps.cosmetic;
    this.printEmpower = cardProps.printEmpower ?? true;
    this.hpCost = cardProps.hpCost ?? 0;
    this.empathized = cardProps.empathized ?? false;
  }

  getDescription(): string {
    const empoweredEffects: string[] = this.effects.map(
      (effect) => `**${this.calculateEffectValue(effect).toFixed(2)}**`
    );
    return this.description(empoweredEffects);
  }

  getTitle(): string {
    return (
      `${this.imitated ? "(Imitated) " : ""}` +
      `${this.empathized ? "(Learned) " : ""}` +
      `${this.title}` +
      `${this.printEmpower ? ` + ${this.empowerLevel}` : ""}`
    );
  }

  calculateEffectValue(effect: number) {
    return Number(
      (effect * (1 + this.empowerLevel * this.EMPOWER_BOOST)).toFixed(2)
    );
  }

  printCard(startingString: string = "") {
    return (
      `${startingString}${this.emoji} **${this.getTitle()}**\n` +
      `  - ${this.getDescription()}`
    );
  }

  clone(): Card {
    return new Card({ ...this });
  }
}
