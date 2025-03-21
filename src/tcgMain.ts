import { PublicThreadChannel, PrivateThreadChannel, User } from "discord.js";
import { GameSettings } from "./commands/tcgChallenge/gameHandler/gameSettings";
import Character from "./tcg/character";
import { getPlayerCharacter } from "./tcgChatInteractions/getPlayerCharacter";
import Game from "./tcg/game";
import { MessageCache } from "./tcgChatInteractions/messageCache";
import {
  sendToThread,
  TCGThread,
  TCGThreads,
} from "./tcgChatInteractions/sendGameMessage";
import { printGameState } from "./tcgChatInteractions/printGameState";
import Card from "./tcg/card";
import { printCharacter } from "./tcgChatInteractions/printCharacter";
import TimedEffect from "./tcg/timedEffect";
import { playSelectedMove } from "./tcgChatInteractions/playSelectedMove";

export const tcgMain = async (
  challenger: User,
  opponent: User,
  gameThread: PublicThreadChannel<false>,
  challengerThread: PrivateThreadChannel,
  opponentThread: PrivateThreadChannel,
  gameSettings: GameSettings,
): Promise<{ winner: User | null; loser: User | null }> => {
  let result: { winner: User | null; loser: User | null } = {
    winner: null,
    loser: null,
  };

  const indexToUserMapping: Record<number, User> = {
    0: challenger,
    1: opponent,
  };

  // game start - ask for character selection
  const challengerCharacterResponsePromise = getPlayerCharacter(
    challenger,
    challengerThread,
  );
  const opponentCharacterResponsePromise = getPlayerCharacter(
    opponent,
    opponentThread,
  );
  const [challengerCharacter, opponentCharacter] = await Promise.all([
    challengerCharacterResponsePromise,
    opponentCharacterResponsePromise,
  ]);

  if (!challengerCharacter || !opponentCharacter) {
    return result;
  }

  const messageCache = new MessageCache();
  const threadsMapping: TCGThreads = {
    [TCGThread.Gameroom]: gameThread,
    [TCGThread.ChallengerThread]: challengerThread,
    [TCGThread.OpponentThread]: opponentThread,
  };

  const game = new Game(
    [
      new Character({
        characterData: challengerCharacter.clone(),
        messageCache: messageCache,
        characterThread: TCGThread.ChallengerThread,
      }),
      new Character({
        characterData: opponentCharacter.clone(),
        messageCache: messageCache,
        characterThread: TCGThread.OpponentThread,
      }),
    ],
    messageCache,
  );
  game.gameStart();

  // game loop
  while (!game.gameOver) {
    game.turnCount += 1;
    messageCache.push(`# Turn ${game.turnCount}`, TCGThread.Gameroom);

    // start of turn resolution
    game.characters.forEach((character: Character, _index: number) => {
      character.additionalMetadata.attackedThisTurn = false;
      character.additionalMetadata.timedEffectAttackedThisTurn = false;
    });
    printGameState(game, messageCache);

    await sendToThread(
      messageCache.flush(TCGThread.Gameroom),
      TCGThread.Gameroom,
      threadsMapping,
      1000,
    );

    // display playable cards
    const characterToPlayableMoveMap: Record<number, Record<string, Card>> = {};
    const characterToDetailsString: Record<
      number,
      { draw: string; hand: string }
    > = {
      0: { draw: "", hand: "" },
      1: { draw: "", hand: "" },
    };

    // get playable cards for round
    await Promise.all(
      game.characters.map(async (character, index) => {
        const useChannel =
          index === 0 ? TCGThread.ChallengerThread : TCGThread.OpponentThread;
        messageCache.push(printCharacter(character, false), useChannel);
        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          1000,
        );

        if (character.skipTurn) {
          messageCache.push(
            `## ${character.name} skips this turn!`,
            useChannel,
          );
        } else {
          character.printHand(useChannel);
          if (gameSettings.revealHand) {
            characterToDetailsString[index].hand =
              messageCache.messages[useChannel].join("\n");
          }

          const currUsableCards = character.getUsableCardsForRound(useChannel);
          characterToPlayableMoveMap[index] = currUsableCards;
          await sendToThread(
            messageCache.flush(useChannel),
            useChannel,
            threadsMapping,
            1000,
          );

          messageCache.push(`## ${character.name}'s Draws:`, useChannel);
          await sendToThread(
            messageCache.flush(useChannel),
            useChannel,
            threadsMapping,
            1000,
          );

          let draws: string[] = [];
          Object.keys(currUsableCards).forEach((key: string) => {
            const currCard = currUsableCards[key];
            draws.push(currCard.printCard(`- ${key}: `));
          });
          const draw = draws.join("\n");
          messageCache.push(draw, useChannel);

          if (gameSettings.revealDraw) {
            characterToDetailsString[index].draw = draw;
          }
        }

        await sendToThread(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          1000,
        );
      }),
    );

    // reveal hand and draw if set
    for (const [index, character] of game.characters.entries()) {
      if (gameSettings.revealHand) {
        await sendToThread(
          [characterToDetailsString[index].hand],
          TCGThread.Gameroom,
          threadsMapping,
          100,
        );
      }
      if (gameSettings.revealDraw) {
        await sendToThread(
          [
            `## ${character.name}'s Draws: `,
            characterToDetailsString[index].draw,
          ],
          TCGThread.Gameroom,
          threadsMapping,
          100,
        );
      }
    }

    // move selection step
    game.additionalMetadata.currentDraws = characterToPlayableMoveMap;

    const challengerSelectedMovePromise = playSelectedMove(
      challenger,
      challengerThread,
      game.characters[0],
      characterToPlayableMoveMap[0],
      gameSettings.turnDurationSeconds,
    );
    const opponentSelectedMovePromise = playSelectedMove(
      opponent,
      opponentThread,
      game.characters[1],
      characterToPlayableMoveMap[1],
      gameSettings.turnDurationSeconds,
    );
    const [challengerSelectedMove, opponentSelectedMove] = await Promise.all([
      challengerSelectedMovePromise,
      opponentSelectedMovePromise,
    ]);

    const characterToSelectedMoveMap: Record<number, Card> = {};
    if (challengerSelectedMove) {
      characterToSelectedMoveMap[0] = challengerSelectedMove;
    }
    if (opponentSelectedMove) {
      characterToSelectedMoveMap[1] = opponentSelectedMove;
    }

    // move resolution step
    const moveFirst = game.getFirstMove(characterToSelectedMoveMap);
    const moveOrder = [moveFirst, 1 - moveFirst];

    moveOrder.forEach(async (characterIndex: number) => {
      if (!game.gameOver) {
        const card = characterToSelectedMoveMap[characterIndex];
        if (card) {
          const character = game.getCharacter(characterIndex);
          messageCache.push(
            `## ${character.name} used **${card.getTitle()}**!`,
            TCGThread.Gameroom,
          );
          card.cardAction?.(game, characterIndex, messageCache);
          if (character.ability.abilityOnCardUse) {
            character.ability.abilityOnCardUse(
              game,
              characterIndex,
              messageCache,
              card,
            );
          }
        }

        // check game over state after each move
        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          result = {
            winner: indexToUserMapping[1 - losingCharacterIndex!],
            loser: indexToUserMapping[losingCharacterIndex!],
          };
          return;
        }
      }
    });

    // end of turn resolution
    let negativePriorityTimedEffect: Record<number, TimedEffect[]> = {
      0: [],
      1: [],
    };

    // handle normal timed effect
    moveOrder.forEach((characterIndex: number) => {
      if (!game.gameOver) {
        const character = game.getCharacter(characterIndex);

        character.timedEffects.forEach((timedEffect: TimedEffect) => {
          if (timedEffect.priority < 0) {
            negativePriorityTimedEffect[characterIndex].push(timedEffect);
          } else {
            timedEffect.reduceTimedEffect(game, characterIndex, messageCache);
          }
        });

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          result = {
            winner: indexToUserMapping[1 - losingCharacterIndex!],
            loser: indexToUserMapping[losingCharacterIndex!],
          };
          return;
        }
      }
    });

    // handle negative priority timed effect
    moveOrder.forEach((characterIndex: number) => {
      if (!game.gameOver) {
        negativePriorityTimedEffect[characterIndex].forEach(
          (timedEffect: TimedEffect) => {
            timedEffect.reduceTimedEffect(game, characterIndex, messageCache);
          },
        );

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          result = {
            winner: indexToUserMapping[1 - losingCharacterIndex!],
            loser: indexToUserMapping[losingCharacterIndex!],
          };
          return;
        }
      }
    });

    // handle end of turn ability and clean up
    moveOrder.forEach((characterIndex: number) => {
      if (!game.gameOver) {
        const character = game.getCharacter(characterIndex);
        character.removeExpiredTimedEffects();
        character.ability.abilityEndOfTurnEffect?.(
          game,
          characterIndex,
          messageCache,
        );

        const losingCharacterIndex = game.checkGameOver();
        if (game.gameOver) {
          result = {
            winner: indexToUserMapping[1 - losingCharacterIndex!],
            loser: indexToUserMapping[losingCharacterIndex!],
          };
          return;
        }
      }
    });
    game.additionalMetadata.lastUsedCards = characterToSelectedMoveMap;

    if (game.gameOver) {
      // immediately flush message cache
      printGameState(game, messageCache, false);
      messageCache.push("# Game over!", TCGThread.Gameroom);
      await sendToThread(
        messageCache.flush(TCGThread.Gameroom),
        TCGThread.Gameroom,
        threadsMapping,
        1000,
      );
    }
  }

  return result;
};
