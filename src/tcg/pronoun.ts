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

  static readonly Masculine = new Pronouns({
    personal: "he",
    possessive: "his",
    reflexive: "himself",
  });

  static readonly Feminine = new Pronouns({
    personal: "she",
    possessive: "her",
    reflexive: "herself",
  });

  static readonly Neutral = new Pronouns({
    personal: "they",
    possessive: "their",
    reflexive: "themself",
  });

  static readonly Impersonal = new Pronouns({
    personal: "it",
    possessive: "its",
    reflexive: "itself",
  });
}
