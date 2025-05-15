import { CHARACTER_LIST } from "@tcg/characters/characterList";

export const goddessDeck = Array.from(
  new Map(
    CHARACTER_LIST.flatMap(({ cards }) =>
      cards.map(({ card }) => [card.title, card])
    )
  ).values()
);
