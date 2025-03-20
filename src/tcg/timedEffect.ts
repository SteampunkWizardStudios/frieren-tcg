import Game from "./game";

export interface TimedEffectProps {
  name: string;
  description: string;
  turnDuration: number;
  priority?: number;
  endOfTurnAction?: (game: Game, characterIndex: number) => void;
  endOfTimedEffectAction?: (game: Game, characterIndex: number) => void;
}

export default class TimedEffect {
  name: string;
  description: string;
  turnDuration: number;
  priority: number;
  endOfTurnAction?: (game: Game, characterIndex: number) => void;
  endOfTimedEffectAction?: (game: Game, characterIndex: number) => void;

  constructor(props: TimedEffectProps) {
    this.name = props.name;
    this.description = props.description;
    this.turnDuration = props.turnDuration;
    this.priority = props.priority ? props.priority : 0;
    this.endOfTurnAction = props.endOfTurnAction;
    this.endOfTimedEffectAction = props.endOfTimedEffectAction;
  }

  passTurn() {
    this.turnDuration -= 1;
  }

  reduceTimedEffect(game: Game, characterIndex: number) {
    this.passTurn();
    this.endOfTurnAction?.(game, characterIndex);
    if (this.turnDuration === 0) {
      this.endOfTimedEffectAction?.(game, characterIndex);
    }
  }

  printEffect() {
    console.log(
      `- ${this.name} (${this.turnDuration} turn${this.turnDuration == 1 ? "" : "s"}): `,
    );
    console.log(`  - ${this.description}`);
  }
}
