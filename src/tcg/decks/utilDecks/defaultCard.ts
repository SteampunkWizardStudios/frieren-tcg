import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";
import Card, { Nature } from "../../card";
import { CardEmoji } from "../../formatting/emojis";
import Game from "../../game";
import { StatsEnum } from "../../stats";

export default class DefaultCards {
  static readonly discardCard: Card = new Card({
    title: "Discard",
    cardMetadata: { nature: Nature.Default },
    description: () =>
      "ATK+1. DEF+1. SPD+1. Discards all of your current active cards. Draw the same number of cards you discarded. Empower all cards in your hand afterwards.",
    effects: [],
    emoji: CardEmoji.RECYCLE,
    printEmpower: false,
    cardAction: (game, characterIndex, messageCache) => {
      const character = game.getCharacter(characterIndex);

      character.adjustStat(1, StatsEnum.ATK);
      character.adjustStat(1, StatsEnum.DEF);
      character.adjustStat(1, StatsEnum.SPD);

      const handsIndicesDescending = Object.keys(
        game.additionalMetadata.currentDraws[characterIndex]
      )
        .map((stringIndex: string) => parseInt(stringIndex))
        .filter((a) => a < 6)
        .sort((a, b) => b - a);
      for (const index of handsIndicesDescending) {
        character.discardCard(index);
        character.drawCard();
      }

      character.empowerHand();
      messageCache.push(
        `All cards in ${character.name}'s hand are empowered!`,
        TCGThread.Gameroom
      );
    },
  });

  static readonly waitCard: Card = new Card({
    title: "Wait",
    cardMetadata: { nature: Nature.Default },
    description: () => "Heals 10 HP. Empower all cards in your hand afterwards.",
    effects: [],
    printEmpower: false,
    emoji: CardEmoji.WAIT,
    cardAction: (game, characterIndex, messageCache) => {
      const character = game.getCharacter(characterIndex);
      character.empowerHand();
      messageCache.push(
        `${character.name} waited it out! All cards in ${character.name}'s hand are empowered!`,
        TCGThread.Gameroom
      );
      character.adjustStat(10, StatsEnum.HP);
    },
  });

  static readonly doNothing: Card = new Card({
    title: "Do Nothing.",
    description: () => "Does nothing. Empower all cards in your hand afterwards.",
    cardMetadata: { nature: Nature.Default},
    effects: [],
    printEmpower: false,
    emoji: CardEmoji.WAIT,
    cardAction: (game, characterIndex, messageCache) => {
      const character = game.getCharacter(characterIndex);
      character.empowerHand();
      messageCache.push(
        `${character.name} did nothing. All cards in ${character.name}'s hand are empowered.`,
        TCGThread.Gameroom
      );
    },
  });

  static readonly forfeitCard: Card = new Card({
    title: "Forfeit",
    cardMetadata: { nature: Nature.Default },
    description: () => "Forfeits the game.",
    effects: [],
    printEmpower: false,
    emoji: CardEmoji.RANDOM,
    cardAction: (game: Game, characterIndex, messageCache) => {
      const character = game.getCharacter(characterIndex);
      messageCache.push(
        `${character.name} forfeited the game!`,
        TCGThread.Gameroom
      );
      game.additionalMetadata.forfeited[characterIndex] = true;
    },
  });
}
