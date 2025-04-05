import { MessageCache } from "../tcgChatInteractions/messageCache";
import Game from "./game";

export interface TimedEffectProps {
  name: string;
  description: string;
  turnDuration: number;
  priority?: number;
  tags?: Record<string, number>;
  endOfTurnAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;
  endOfTimedEffectAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;
  replacedAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;
}

export default class TimedEffect {
  name: string;
  description: string;
  turnDuration: number;
  priority: number;
  tags: Record<string, number>;
  endOfTurnAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;
  endOfTimedEffectAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;
  replacedAction?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) => void;

  constructor(props: TimedEffectProps) {
    this.name = props.name;
    this.description = props.description;
    this.turnDuration = props.turnDuration;
    this.priority = props.priority ? props.priority : 0;
    this.tags = props.tags ?? {};
    this.endOfTurnAction = props.endOfTurnAction;
    this.endOfTimedEffectAction = props.endOfTimedEffectAction;
    this.replacedAction = props.replacedAction;
  }

  passTurn() {
    this.turnDuration -= 1;
  }

  reduceTimedEffect(
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
  ) {
    this.passTurn();
    this.endOfTurnAction?.(game, characterIndex, messageCache);
    if (this.turnDuration === 0) {
      this.endOfTimedEffectAction?.(game, characterIndex, messageCache);
    }
  }

  printEffect() {
    return `- ${this.name} (${this.turnDuration} turn${this.turnDuration == 1 ? "" : "s"}):\n  - ${this.description}`;
  }
}
