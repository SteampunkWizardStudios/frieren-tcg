import Card from "./card";

export default class Deck {
  activePile: Card[];
  discardPile: Card[];

  constructor(cardCount: { card: Card; count: number }[]) {
    this.activePile = [];
    cardCount.forEach(({ card, count }) => {
      const newCards = [];
      for (let i = 0; i < count; i++) {
        const newCard = card.clone();
        newCards.push(newCard);
      }
      this.activePile.push(...newCards);
    });
    this.discardPile = [];
    this.shuffle();
  }

  drawCard(): Card {
    if (this.activePile.length === 0) {
      this.activePile = [...this.discardPile];
      this.discardPile = [];
      this.shuffle();
    }
    return this.activePile.pop()!;
  }

  discardCard(card: Card) {
    this.discardPile.push(card);
  }

  // per card, randomly select another card in the deck and swap the two
  private shuffle() {
    for (let i = 0; i < this.activePile.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.activePile[i], this.activePile[j]] = [
        this.activePile[j],
        this.activePile[i],
      ];
    }
  }
}
