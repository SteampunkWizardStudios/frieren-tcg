import { CHARACTER_LIST } from "@tcg/characters/characterList";

const goddessDeck = Array.from(
  new Map(
    CHARACTER_LIST.flatMap(({ cards }) =>
      cards.map(({ card }) => [card.title, card])
    )
  ).values()
);

export default goddessDeck;