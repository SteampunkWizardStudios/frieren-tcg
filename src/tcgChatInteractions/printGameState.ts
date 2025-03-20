import Character from "../tcg/character";
import Game from "../tcg/game";
import { printCharacter } from "./printCharacter";

// only print game state. do not update state
export const printGameState = (
  game: Game,
  obfuscateInformation: boolean = true,
): string => {
  let printStack: String[] = [];
  game.characters.forEach((character: Character) => {
    printStack.push(printCharacter(character, obfuscateInformation));
    if (character.skipTurn) {
      printStack.push(`## ${character.name} skips this turn!`);
    }
  });
  return printStack.join("\n");
};
