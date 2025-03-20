import Card from "../../card";
import { CharacterName } from "../../characters/metadata/CharacterName";
import { CardEmoji } from "../../formatting/emojis";
import { StatsEnum } from "../../stats";

export default class DefaultCards {
  static readonly discardCard: Card = new Card({
    title: "Discard",
    description: () =>
      "Discards all cards in your current draws. Draw the same number of cards you discarded.",
    effects: [],
    emoji: CardEmoji.RECYCLE,
    printEmpower: false,
    cardAction: (game, characterIndex) => {
      const character = game.getCharacter(characterIndex);
      character.empowerHand();
      console.log(`All cards in ${character.name}'s hand are empowered!`);

      const handsIndicesDescending = Object.keys(
        game.additionalMetadata.currentDraws[characterIndex],
      )
        .map((stringIndex: string) => parseInt(stringIndex))
        .filter((a) => a < 6)
        .sort((a, b) => b - a);
      for (const index of handsIndicesDescending) {
        character.discardCard(index);
        character.drawCard();
      }
    },
  });

  static readonly waitCard: Card = new Card({
    title: "Wait",
    description: () => "Heals 10 HP.",
    effects: [],
    printEmpower: false,
    emoji: CardEmoji.WAIT,
    cardAction: (game, characterIndex) => {
      const character = game.getCharacter(characterIndex);
      character.empowerHand();
      console.log(
        `${character.name} waited it out! All cards in ${character.name}'s hand are empowered!`,
      );
      character.adjustStat(10, StatsEnum.HP);
    },
  });
}
