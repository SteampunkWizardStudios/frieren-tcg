import { CardEmoji } from "./formatting/emojis";
import Game from "./game";

export type CardProps = {
  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  cardAction: (game: Game, characterIndex: number) => void;
  priority?: number;
  empowerLevel?: number;
  tags?: Record<string, number>;
  emoji?: CardEmoji;
  printEmpower?: boolean;
};

export default class Card implements CardProps {
  readonly EMPOWER_BOOST = 0.1;

  title: string;
  description: (formattedEffects: string[]) => string;
  effects: number[];
  cardAction: (game: Game, characterIndex: number) => void;
  empowerLevel: number;
  priority: number;
  tags: Record<string, number>;
  emoji: CardEmoji;
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
    this.printEmpower = cardProps.printEmpower ?? true;
  }

  getDescription(): string {
    const empoweredEffects: string[] = this.effects.map(
      (effect) => `**${this.calculateEffectValue(effect).toFixed(2)}**`,
    );
    return this.description(empoweredEffects);
  }

  getTitle(): string {
    return `${this.title} + ${this.empowerLevel}`;
  }

  calculateEffectValue(effect: number) {
    return Number(
      (effect * (1 + this.empowerLevel * this.EMPOWER_BOOST)).toFixed(2),
    );
  }

  printCard(startingString: string = "") {
    const empowerString = this.printEmpower ? ` + ${this.empowerLevel}` : "";
    console.log(
      `${startingString}${this.emoji} **${this.title}${empowerString}**`,
    );
    console.log(`  - ${this.getDescription()}`);
  }

  clone(): Card {
    return new Card({ ...this });
  }
}
