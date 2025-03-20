import Stats, { StatsEnum } from "./stats";
import Deck from "./deck";
import Card from "./card";
import TimedEffect from "./timedEffect";
import Game from "./game";
import { Ability } from "./ability";
import { CharacterEmoji, statDetails } from "./formatting/emojis";
import Rolls from "./util/rolls";
import { CharacterAdditionalMetadata } from "./additionalMetadata/characterAdditionalMetadata";
import Pronouns from "./pronoun";
import { CharacterName } from "./characters/metadata/CharacterName";
import DefaultCards from "./decks/utilDecks/defaultCard";

export interface CharacterCosmetic {
  pronouns: Pronouns;
  emoji: CharacterEmoji;
  color: number;
  imageUrl: string;
}

export interface CharacterProps {
  name: CharacterName;
  cosmetic: CharacterCosmetic;
  stats: Stats;
  cards: { card: Card; count: number }[];
  ability: Ability;
  additionalMetadata: CharacterAdditionalMetadata;
}

export default class Character {
  name: CharacterName;
  cosmetic: CharacterCosmetic;

  stats: Stats;
  cards: { card: Card; count: number }[];
  deck: Deck;
  ability: Ability;

  initialStats: Stats;
  hand: Card[];
  timedEffects: TimedEffect[];
  skipTurn: boolean;

  additionalMetadata: CharacterAdditionalMetadata;

  constructor(characterProps: CharacterProps) {
    this.name = characterProps.name;
    this.cosmetic = characterProps.cosmetic;
    this.stats = characterProps.stats;
    this.cards = characterProps.cards;
    this.ability = characterProps.ability;
    this.additionalMetadata = characterProps.additionalMetadata;

    this.initialStats = characterProps.stats.clone();
    this.deck = new Deck(characterProps.cards);
    this.hand = [];
    this.timedEffects = [];
    this.skipTurn = false;
  }

  drawStartingHand() {
    for (let i = 0; i < 6; i++) {
      this.drawCard();
    }
  }

  drawCard(): Card {
    const drawnCard = this.deck.drawCard();
    this.hand.push(drawnCard);
    return drawnCard;
  }

  discardCard(handIndex: number): Card {
    if (handIndex < this.hand.length) {
      const discardedCard = this.hand.splice(handIndex, 1)[0];
      this.deck.discardCard(discardedCard);
      console.log(
        `Discarded ${discardedCard.title} + ${discardedCard.empowerLevel}`,
      );
      return discardedCard;
    } else {
      throw new Error("index given greater than hand's length.");
    }
  }

  // discard a card and empower all other cards in hand
  playCard(handIndex: number): Card {
    const discardedCard = this.discardCard(handIndex);

    const card = this.hand[handIndex];

    // empower remaining cards
    this.empowerHand();

    // draw a new card
    this.drawCard();
    return discardedCard;
  }

  getUsableCardsForRound(): Record<string, Card> {
    this.printHand();

    const indexToUsableCardMap: Record<string, Card> = {};
    // roll 4d6
    const rolls = [];
    for (let i = 0; i < 4; i++) {
      rolls.push(Rolls.rollD6());
    }
    console.log(`\n### Draws: ${rolls.sort().join(", ")}`);
    for (const roll of rolls) {
      if (roll < this.hand.length) {
        if (roll in indexToUsableCardMap) {
          // empower corresponding card
          indexToUsableCardMap[roll].empowerLevel += 1;
        } else {
          const card = this.hand[roll];
          indexToUsableCardMap[roll] = card;
        }
      }
    }

    if (this.name !== CharacterName.Stille) {
      indexToUsableCardMap["8"] = DefaultCards.discardCard.clone();
      indexToUsableCardMap["9"] = DefaultCards.waitCard.clone();
    }

    console.log();
    return indexToUsableCardMap;
  }

  printHand() {
    console.log(`# ${this.name}'s Hand: `);
    this.hand.forEach((card, index) => {
      card.printCard(`- ${index}: `);
    });
  }

  // adjust a character's stat
  // returns whether the operation was a success
  // there is no failure condition for now
  adjustStat(adjustValue: number, stat: StatsEnum): boolean {
    const roundedAdjustValue = Number(adjustValue.toFixed(2));
    const roundedStatValue = Number(
      (this.stats.stats[stat] + roundedAdjustValue).toFixed(2),
    );
    if (this.setStatValue(roundedStatValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      if (adjustValue < 0) {
        console.log(
          `${this.name} *lost* ${statDetails[stat].emoji} *${-1 * roundedAdjustValue}* ${statDescription}!`,
        );
        if (stat !== StatsEnum.HP || !this.additionalMetadata.manaSuppressed) {
          console.log(
            `${this.name}'s new ${statDescription}: **${this.stats.stats[stat]}**`,
          );
        }
      } else {
        console.log(
          `${this.name} **gained** ${statDetails[stat].emoji} **${roundedAdjustValue}** ${statDescription}!`,
        );
        if (stat !== StatsEnum.HP || !this.additionalMetadata.manaSuppressed) {
          console.log(
            `${this.name}'s new ${statDescription}: **${this.stats.stats[stat]}**`,
          );
        }
      }

      return true;
    } else {
      console.log(`${this.name}'s stat failed to be set! The move failed!`);
      return false;
    }
  }

  setStat(statValue: number, stat: StatsEnum): boolean {
    if (this.setStatValue(statValue, stat)) {
      const statDescription =
        stat === StatsEnum.Ability ? "Ability Counter" : stat;
      console.log(`${this.name}'s ${statDescription} is set to ${statValue}!`);
      return true;
    } else {
      console.log(`${this.name}'s stat failed to be set! The move failed!`);
      return false;
    }
  }

  private setStatValue(newValue: number, stat: StatsEnum): boolean {
    if (newValue <= 1 && stat !== StatsEnum.Ability) {
      this.stats.stats[stat] = 1;
    } else if (
      stat === StatsEnum.HP &&
      newValue > this.initialStats.stats.HP &&
      !this.additionalMetadata.overheal
    ) {
      this.stats.stats[stat] = this.initialStats.stats.HP;
    } else {
      this.stats.stats[stat] = newValue;
    }

    return true;
  }

  removeExpiredTimedEffects() {
    this.timedEffects = this.timedEffects.filter(
      (timedEffect) => timedEffect.turnDuration > 0,
    );
  }

  empowerHand() {
    this.hand.forEach((card) => {
      card.empowerLevel += 1;
    });
  }

  clone() {
    return new Character({ ...this });
  }
}
