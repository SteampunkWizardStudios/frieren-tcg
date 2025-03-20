import { StatsEnum } from "./stats";
import Character from "./character";

export type CardAction = {
  name: string;
  onEnterMessage: string;
  onExitMessage: string;

  execute(character: Character): void;
};

type StatActionProps = {
  name: string;
  onEnterMessage: string;
  onExitMessage: string;
  stat: StatsEnum;
  amount: number;
  onSelf?: boolean;
};

export class StatAction implements CardAction {
  name: string;
  onEnterMessage: string;
  onExitMessage: string;

  stat: StatsEnum;
  amount: number;
  onSelf: boolean;

  constructor(props: StatActionProps) {
    this.name = props.name;
    this.onEnterMessage = props.onEnterMessage;
    this.onExitMessage = props.onExitMessage;
    this.stat = props.stat;
    this.amount = props.amount;
    this.onSelf = props.onSelf ?? true;
  }

  execute(onCharacter: Character) {
    onCharacter.setStat(
      onCharacter.stats.stats[this.stat] + this.amount,
      this.stat,
    );
  }
}
