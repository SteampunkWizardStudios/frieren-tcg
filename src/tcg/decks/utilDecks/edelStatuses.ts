import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";

export const sleepy = new Card({
  title: "Sleepy",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.GENERIC,
  printEmpower: false,
  description: () =>
    "If you do not play this card, skip next turn. This card is removed from your deck after it becomes playable, regardless of it was played.",
  effects: [],
  cardAction: ({ name, sendToGameroom }) => {
    sendToGameroom(`${name} was falling asleep but woke up!`);
  },
  onTurnEnd: function (this: Card, _context) {
    // if played, remove from deck
    this.cardMetadata.temporary &&= false;
  }
});

export const mesmerized = new Card({
  title: "Mesmerized",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.GENERIC,
  printEmpower: false,
  description: () =>
    "If you play this card on the first turn it is playable, it is removed from your deck, otherwise, this card cannot be removed from your deck.",
  effects: [],
  cardAction: function (this: Card, { name, opponent, sendToGameroom }) {
    if (this.cardMetadata.temporary) {
      sendToGameroom(
        `${name} was mesmerized by ${opponent.name}'s eyes but snapped out of it!`
      );
    } else {
      sendToGameroom(`Card became permanent`);
    }
  },
});

export const weakened = new Card({
  title: "Weakened",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.GENERIC,
  description: ([debuff]) =>
    `If you do not play this card, reduce ATK, DEF, SPD by ${debuff}. This card is removed from your deck after it becomes playable, regardless of it was played.`,
  effects: [2],
  cardAction: ({ name, opponent, sendToGameroom }) => {
    sendToGameroom(
      `${name} was mesmerized by ${opponent.name}'s eyes but snapped out of it!`
    );
  },
});
