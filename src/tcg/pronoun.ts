export interface PronounsProps {
  possessive: string;
  reflexive: string;
}

export default class Pronouns {
  readonly possessive;
  readonly reflexive;

  constructor(props: PronounsProps) {
    this.possessive = props.possessive;
    this.reflexive = props.reflexive;
  }
}
