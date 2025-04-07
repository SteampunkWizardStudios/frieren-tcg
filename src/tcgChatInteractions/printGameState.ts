import Character from "../tcg/character";
import Game from "../tcg/game";
import { MessageCache } from "./messageCache";
import { printCharacter } from "./printCharacter";
import { TCGThread } from "./sendGameMessage";

// only print game state. do not update state
export const printGameState = (
  game: Game,
  messageCache: MessageCache,
  obfuscateInformation: boolean = true
) => {
  game.characters.forEach((character: Character) => {
    messageCache.push(
      printCharacter(character, obfuscateInformation),
      TCGThread.Gameroom
    );
    if (character.skipTurn) {
      messageCache.push(
        `## ${character.name} skips this turn!`,
        TCGThread.Gameroom
      );
    }
  });
};
