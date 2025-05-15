import { StatsEnum } from "@src/tcg/stats";
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
  cardAction: function (this: Card, { name, self, sendToGameroom }) {
    sendToGameroom(`${name} was falling asleep but woke up!`);

    self.deck.removeCard(this);
  },
  onNotPlayed: function (this: Card, { self }) {
    self.deck.removeCard(this);
    self.skipTurn = true;
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
  cardAction: function (this: Card, { self, name, opponent, sendToGameroom }) {
    if (this.cardMetadata.temporary) {
      sendToGameroom(
        `${name} was mesmerized by ${opponent.name}'s eyes but snapped out of it!`
      );
      self.deck.removeCard(this);
    } else {
      sendToGameroom(`${name} was mesmerized by ${opponent.name}'s eyes!`);
    }
  },
  onNotPlayed: function (this: Card, { self }) {
    if (this.cardMetadata.temporary) {
      self.deck.removeCard(this);
    }
  }
});

export const weakened = new Card({
  title: "Weakened",
  cardMetadata: { nature: Nature.None, temporary: true },
  emoji: CardEmoji.GENERIC,
  description: ([debuff]) =>
    `If you do not play this card, reduce ATK, DEF, SPD by ${debuff}. This card is removed from your deck after it becomes playable, regardless of it was played.`,
  effects: [2],
  cardAction: function (this: Card, { name, self, opponent, sendToGameroom }) {
    sendToGameroom(
      `${name} felt compelled by ${opponent.name} to surrender but didn't give in!`
    );
    self.deck.removeCard(this);
  },
  onNotPlayed: function (this: Card, { self, selfStat }) {
    self.deck.removeCard(this);

    [StatsEnum.ATK, StatsEnum.DEF, StatsEnum.SPD].forEach((stat) => {
      selfStat(0, stat, -1);
    });
  }
});
