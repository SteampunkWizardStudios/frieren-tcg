import { VISIBLE_CHARACTERS } from "@tcg/characters/characterList";

const goddessDeck = Array.from(
  new Map(
    VISIBLE_CHARACTERS.flatMap(({ cards }) =>
      cards.map(({ card }) => [card.title, card])
    )
  ).values()
);

export default goddessDeck;
