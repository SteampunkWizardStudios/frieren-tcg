import { PublicThreadChannel, PrivateThreadChannel, User } from "discord.js";
import { GameSettings } from "./commands/tcgChallenge/gameHandler/gameSettings";
import Character from "./tcg/character";
import { getPlayerCharacter } from "./tcgChatInteractions/getPlayerCharacter";
import Game from "./tcg/game";
import { MessageCache } from "./tcgChatInteractions/messageCache";
import {
  logAndSend,
  TCGThread,
  TCGThreads,
} from "./tcgChatInteractions/sendGameMessage";
import { printGameState } from "./tcgChatInteractions/printGameState";
import Card from "./tcg/card";
import { printCharacter } from "./tcgChatInteractions/printCharacter";

export const tcgMain = async (
  challenger: User,
  opponent: User,
  gameThread: PublicThreadChannel<false>,
  challengerThread: PrivateThreadChannel,
  opponentThread: PrivateThreadChannel,
  gameSettings: GameSettings,
): Promise<{ winner: User | null; loser: User | null }> => {
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
    return { winner: null, loser: null };
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
  while (true) {
    game.turnCount += 1;
    messageCache.push(`# Turn ${game.turnCount}`, TCGThread.Gameroom);

    // start of turn resolution
    game.characters.forEach((character: Character, _index: number) => {
      character.additionalMetadata.attackedThisTurn = false;
      character.additionalMetadata.timedEffectAttackedThisTurn = false;
    });
    messageCache.push(printGameState(game), TCGThread.Gameroom);
    console.log();

    await logAndSend(
      messageCache.flush(TCGThread.Gameroom),
      TCGThread.Gameroom,
      threadsMapping,
      3000,
    );

    // display playable cards
    const characterToPlayableMoveMap: Record<number, Record<string, Card>> = {};

    await Promise.all(
      game.characters.map(async (character, index) => {
        const useChannel =
          index === 0 ? TCGThread.ChallengerThread : TCGThread.OpponentThread;
        messageCache.push(printCharacter(character, false), useChannel);
        await logAndSend(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          2000,
        );

        if (character.skipTurn) {
          messageCache.push(
            `## ${character.name} skips this turn!`,
            useChannel,
          );
        } else {
          const currUsableCards = character.getUsableCardsForRound(useChannel);
          characterToPlayableMoveMap[index] = currUsableCards;
          await logAndSend(
            messageCache.flush(useChannel),
            useChannel,
            threadsMapping,
            2000,
          );

          messageCache.push(`## ${character.name}'s Draws:`, useChannel);
          await logAndSend(
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
          messageCache.push(draws.join("\n"), useChannel);
        }

        await logAndSend(
          messageCache.flush(useChannel),
          useChannel,
          threadsMapping,
          1000,
        );
      }),
    );

    return { winner: null, loser: null };

    //     console.log(
    //       `/vpoll name:What move to use? options:${vpollA} end-time:2m multiselect:True`,
    //     );
    //     console.log(
    //       `/vpoll name:What move to use? options:${vpollB} end-time:2m multiselect:True`,
    //     );

    //     game.additionalMetadata.currentDraws = characterToPlayableMoveMap;
    //     console.log();

    //     // move selection step
    //     const characterToSelectedMoveMap: Record<number, Card> = {};
    //     game.characters.forEach(async (character: Character, index: number) => {
    //       if (character.skipTurn) {
    //         character.skipTurn = false; // handle turn skip
    //         return;
    //       } else {
    //         let selection: string;
    //         while (true) {
    //           selection = readlineSync.question(
    //             `Which move do you want to use for ${character.name}? (move index) `,
    //           );
    //           if (selection in characterToPlayableMoveMap[index]) {
    //             const selectedCard = characterToPlayableMoveMap[index][selection];
    //             const confirmation = readlineSync.question(
    //               `Are you sure you want to play ${selectedCard.getTitle()}? (Y/n) `,
    //             );
    //             if (confirmation !== "Y") {
    //               continue;
    //             } else {
    //               const intSelection = parseInt(selection);
    //               if (intSelection < 6) {
    //                 character.playCard(parseInt(selection));
    //               }
    //               characterToSelectedMoveMap[index] = selectedCard; // moving this before an await command so it resolves definitively

    //               await logAndSend(
    //                 [`You played **${selectedCard.getTitle()}**`],
    //                 index === 0 ? RPGChannel.RoomA : RPGChannel.RoomB,
    //               );
    //               break;
    //             }
    //           } else {
    //             console.log("Invalid selection");
    //           }
    //         }
    //       }
    //     });
    //     console.log();

    //     // move resolution step
    //     const moveFirst = game.getFirstMove(characterToSelectedMoveMap);
    //     const moveOrder = [moveFirst, 1 - moveFirst];

    //     let gameOver = false;
    //     moveOrder.forEach(async (characterIndex: number) => {
    //       if (!gameOver) {
    //         const card = characterToSelectedMoveMap[characterIndex];
    //         if (card) {
    //           const character = game.getCharacter(characterIndex);
    //           messageCache.push(
    //             `## ${character.name} used **${card.getTitle()}**!`,
    //             RPGChannel.Gameroom,
    //           );
    //           card.cardAction?.(game, characterIndex, messageCache);
    //           if (character.ability.abilityOnCardUse) {
    //             character.ability.abilityOnCardUse(
    //               game,
    //               characterIndex,
    //               messageCache,
    //               card,
    //             );
    //           }
    //         }

    //         // check game over state after each move
    //         if (gameOver || checkGameOver(game)) {
    //           gameOver = true;
    //           return;
    //         }

    //         console.log();
    //       }
    //     });
    //     console.log();

    //     // end of turn resolution
    //     let negativePriorityTimedEffect: Record<number, TimedEffect[]> = {
    //       0: [],
    //       1: [],
    //     };

    //     // handle normal timed effect
    //     moveOrder.forEach((characterIndex: number) => {
    //       if (!gameOver) {
    //         const character = game.getCharacter(characterIndex);

    //         character.timedEffects.forEach((timedEffect: TimedEffect) => {
    //           if (timedEffect.priority < 0) {
    //             negativePriorityTimedEffect[characterIndex].push(timedEffect);
    //           } else {
    //             timedEffect.reduceTimedEffect(game, characterIndex, messageCache);
    //           }
    //         });

    //         if (gameOver || checkGameOver(game)) {
    //           gameOver = true;
    //           return;
    //         }
    //       }
    //     });

    //     // handle negative priority timed effect
    //     moveOrder.forEach((characterIndex: number) => {
    //       if (!gameOver) {
    //         negativePriorityTimedEffect[characterIndex].forEach(
    //           (timedEffect: TimedEffect) => {
    //             timedEffect.reduceTimedEffect(game, characterIndex, messageCache);
    //           },
    //         );

    //         if (gameOver || checkGameOver(game)) {
    //           gameOver = true;
    //           return;
    //         }
    //       }
    //     });

    //     // handle end of turn ability and clean up
    //     moveOrder.forEach((characterIndex: number) => {
    //       if (!gameOver) {
    //         const character = game.getCharacter(characterIndex);
    //         character.removeExpiredTimedEffects();
    //         character.ability.abilityEndOfTurnEffect?.(
    //           game,
    //           characterIndex,
    //           messageCache,
    //         );

    //         if (gameOver || checkGameOver(game)) {
    //           gameOver = true;
    //           return;
    //         }
    //       }
    //     });

    //     if (gameOver || checkGameOver(game)) {
    //       // immediately flush message cache
    //       messageCache.push(printGameState(game, false), RPGChannel.Gameroom);
    //       messageCache.push("# Game over!", RPGChannel.Gameroom);
    //       await logAndSend(
    //         messageCache.flush(RPGChannel.Gameroom),
    //         RPGChannel.Gameroom,
    //       );
    //       return;
    //     }

    //     game.additionalMetadata.lastUsedCards = characterToSelectedMoveMap;
    //     console.log();
  }
};

// function checkGameOver(game: Game): boolean {
//   if (!game.gameOver) {
//     game.isGameOver();
//   }
//   if (game.gameOver) {
//     return true;
//   }

//   return false;
// }

// (async () => {
//   await login();
//   client.on(Events.ClientReady, () => {
//     main();
//   });
// })();
