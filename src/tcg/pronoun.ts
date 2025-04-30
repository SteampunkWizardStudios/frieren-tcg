export interface PronounsProps {
  personal: string;
  possessive: string;
  reflexive: string;
}

export default class Pronouns {
  readonly personal;
  readonly possessive;
  readonly reflexive;

  constructor(props: PronounsProps) {
    this.personal = props.personal;
    this.possessive = props.possessive;
    this.reflexive = props.reflexive;
  }
}
