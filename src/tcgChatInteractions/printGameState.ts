import Character from "@tcg/character";
import Game from "@tcg/game";
import { MessageCache } from "./messageCache";
import { printCharacter } from "./printCharacter";
import { TCGThread } from "./sendGameMessage";
import { FlammeTheory } from "@src/tcg/additionalMetadata/gameAdditionalMetadata";

// only print game state. do not update state
export const printGameState = (
  game: Game,
  messageCache: MessageCache,
  obfuscateInformation: boolean = true
) => {
  game.characters.forEach((character: Character) => {
    messageCache.push(
      printCharacter(game, character, obfuscateInformation),
      TCGThread.Gameroom
    );
    if (character.skipTurn) {
      messageCache.push(
        `## ${character.name} skips this turn!`,
        TCGThread.Gameroom
      );
    }
  });

  const theoryText = printTheory(game.additionalMetadata.flammeTheory);
  if (theoryText) {
    messageCache.push(theoryText, TCGThread.Gameroom);
  }
};

export const printTheory = (
  flammeTheories: Record<FlammeTheory, boolean>
): string | undefined => {
  let flammeTheoriesDiscoveryState = "";
  Object.entries(flammeTheories).forEach(([theory, isDiscovered]) => {
    if (isDiscovered) {
      flammeTheoriesDiscoveryState += `**${theory}**: Discovered  `;
    }
  });

  if (flammeTheoriesDiscoveryState.length > 0) {
    return `### Flamme's Theories:\n${flammeTheoriesDiscoveryState}`;
  }
};
