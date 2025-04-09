import { MessageCache } from "../tcgChatInteractions/messageCache";
import { CardEmoji } from "./formatting/emojis";
import Game from "./game";

export interface CardCosmetic {
  cardImageUrl?: string;
  cardGif?: string;
}

export type CardProps = {
  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji?: CardEmoji;
  cosmetic?: CardCosmetic;
  cardAction: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  priority?: number;
  empowerLevel?: number;
  tags?: Record<string, number>;
  printEmpower?: boolean;
};

export default class Card implements CardProps {
  readonly EMPOWER_BOOST = 0.1;

  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  emoji: CardEmoji;
  cosmetic?: CardCosmetic | undefined;
  cardAction: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  empowerLevel: number;
  priority: number;
  tags: Record<string, number>;
  printEmpower: boolean;

  constructor(cardProps: CardProps) {
    this.title = cardProps.title;
    this.description = cardProps.description;
    this.effects = cardProps.effects;
    this.cardAction = cardProps.cardAction;
    this.priority = cardProps.priority ?? 0;
    this.empowerLevel = cardProps.empowerLevel ?? 0;
    this.tags = cardProps.tags ?? {};
    this.emoji = cardProps.emoji ?? CardEmoji.GENERIC;
    this.cosmetic = cardProps.cosmetic;
    this.printEmpower = cardProps.printEmpower ?? true;
  }

  getDescription(): string {
    const empoweredEffects: string[] = this.effects.map((effect) =>
      this.calculateEffectValue(effect).toFixed(2)
    );
    return this.description(empoweredEffects);
  }

  getTitle(): string {
    return `${this.title}` + `${this.printEmpower ? ` + ${this.empowerLevel}` : ""}`;
  }

  calculateEffectValue(effect: number) {
    return Number(
      (effect * (1 + this.empowerLevel * this.EMPOWER_BOOST)).toFixed(2)
    );
  }

  printCard(startingString: string = "") {
    const empowerString = this.printEmpower ? ` + ${this.empowerLevel}` : "";
    return (
      `${startingString}${this.emoji} **${this.title}${empowerString}**\n` +
      `  - ${this.getDescription()}`
    );
  }

  clone(): Card {
    return new Card({ ...this });
  }
}
