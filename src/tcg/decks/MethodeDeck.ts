import Card, { Nature } from "@tcg/card";

const scatterShot = new Card({
  title: "Scatter Shot",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of next turn`,
  effects: [3],
  cardAction: () => {},
});

const methodeDeck = [{ card: scatterShot, count: 16 }];

export default methodeDeck;
