import { PublicThreadChannel, PrivateThreadChannel, User } from "discord.js";
import { GameSettings } from "./commands/tcgChallenge/gameHandler/gameSettings";
import Character from "./tcg/character";
import { getPlayerCharacter } from "./tcgChatInteractions/getPlayerCharacter";

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

  return { winner: challenger, loser: opponent };

  // const game = new Game([
  //   characterList[characterA].clone(),
  //   characterList[characterB].clone(),
  // ]);
  // game.gameStart();

  // // discord client login
  // // login();

  // // game loop
  // while (true) {
  //   game.turnCount += 1;
  //   console.log(`# Turn ${game.turnCount}`);

  //   // start of turn resolution
  //   game.characters.forEach((character: Character, _index: number) => {
  //     character.additionalMetadata.attackedThisTurn = false;
  //     character.additionalMetadata.timedEffectAttackedThisTurn = false;
  //   });
  //   printGameState(game);
  //   console.log();

  //   // display playable cards
  //   const characterToPlayableMoveMap: Record<number, Record<string, Card>> = {};
  //   game.characters.forEach((character: Character, index: number) => {
  //     printCharacter(character, false);
  //     if (character.skipTurn) {
  //       console.log(`## ${character.name} skips this turn!`);
  //     } else {
  //       const currUsableCards = character.getUsableCardsForRound();
  //       characterToPlayableMoveMap[index] = currUsableCards;

  //       console.log(`## ${character.name}'s Draws: `);

  //       let vpollOptionsList = "";
  //       const optionsCount = Object.keys(currUsableCards).length;

  //       Object.keys(currUsableCards).forEach((key: string, index: number) => {
  //         const currCard = currUsableCards[key];
  //         currCard.printCard(`- ${key}: `);
  //         vpollOptionsList += `${key}: ${currCard.getTitle()}`;
  //         if (index < optionsCount - 1) {
  //           vpollOptionsList += ", ";
  //         }
  //       });

  //       console.log("Vpoll command:");
  //       console.log(
  //         `/vpoll name:Which Move To Use? options:${vpollOptionsList} end-time:2m multiselect:True`,
  //       );
  //     }
  //     console.log();
  //   });
  //   game.additionalMetadata.currentDraws = characterToPlayableMoveMap;
  //   console.log();

  //   // move selection step
  //   const characterToSelectedMoveMap: Record<number, Card> = {};
  //   game.characters.forEach((character: Character, index: number) => {
  //     if (character.skipTurn) {
  //       character.skipTurn = false; // handle turn skip
  //       return;
  //     } else {
  //       let selection: string;
  //       while (true) {
  //         selection = readlineSync.question(
  //           `Which move do you want to use for ${character.name}? (move index) `,
  //         );
  //         if (selection in characterToPlayableMoveMap[index]) {
  //           const selectedCard = characterToPlayableMoveMap[index][selection];
  //           const confirmation = readlineSync.question(
  //             `Are you sure you want to play ${selectedCard.getTitle()}? (Y/n) `,
  //           );
  //           if (confirmation !== "Y") {
  //             continue;
  //           } else {
  //             const intSelection = parseInt(selection);
  //             if (intSelection < 6) {
  //               character.playCard(parseInt(selection));
  //             }
  //             console.log(`You played ${selectedCard.getTitle()}`);
  //             characterToSelectedMoveMap[index] = selectedCard;
  //             break;
  //           }
  //         } else {
  //           console.log("Invalid selection");
  //         }
  //       }
  //     }
  //   });
  //   console.log();

  //   // move resolution step
  //   const moveFirst = game.getFirstMove(characterToSelectedMoveMap);
  //   const moveOrder = [moveFirst, 1 - moveFirst];

  //   let gameOver = false;
  //   moveOrder.forEach((characterIndex: number) => {
  //     if (!gameOver) {
  //       const card = characterToSelectedMoveMap[characterIndex];
  //       if (card) {
  //         const character = game.getCharacter(characterIndex);
  //         console.log(`## ${character.name} used **${card.getTitle()}**!`);
  //         card.cardAction?.(game, characterIndex);
  //         if (character.ability.abilityOnCardUse) {
  //           character.ability.abilityOnCardUse(game, characterIndex, card);
  //         }
  //       }

  //       // check game over state after each move
  //       if (gameOver || checkGameOver(game)) {
  //         gameOver = true;
  //         return;
  //       }

  //       console.log();
  //     }
  //   });
  //   console.log();

  //   // end of turn resolution
  //   let negativePriorityTimedEffect: Record<number, TimedEffect[]> = {
  //     0: [],
  //     1: [],
  //   };

  //   // handle normal timed effect
  //   moveOrder.forEach((characterIndex: number) => {
  //     if (!gameOver) {
  //       const character = game.getCharacter(characterIndex);

  //       character.timedEffects.forEach((timedEffect: TimedEffect) => {
  //         if (timedEffect.priority < 0) {
  //           negativePriorityTimedEffect[characterIndex].push(timedEffect);
  //         } else {
  //           timedEffect.reduceTimedEffect(game, characterIndex);
  //         }
  //       });

  //       if (gameOver || checkGameOver(game)) {
  //         gameOver = true;
  //         return;
  //       }
  //     }
  //   });

  //   // handle negative priority timed effect
  //   moveOrder.forEach((characterIndex: number) => {
  //     if (!gameOver) {
  //       negativePriorityTimedEffect[characterIndex].forEach(
  //         (timedEffect: TimedEffect) => {
  //           timedEffect.reduceTimedEffect(game, characterIndex);
  //         },
  //       );

  //       if (gameOver || checkGameOver(game)) {
  //         gameOver = true;
  //         return;
  //       }
  //     }
  //   });

  //   // handle end of turn ability and clean up
  //   moveOrder.forEach((characterIndex: number) => {
  //     if (!gameOver) {
  //       const character = game.getCharacter(characterIndex);
  //       character.removeExpiredTimedEffects();
  //       character.ability.abilityEndOfTurnEffect?.(game, characterIndex);

  //       if (gameOver || checkGameOver(game)) {
  //         gameOver = true;
  //         return;
  //       }
  //     }
  //   });

  //   if (gameOver || checkGameOver(game)) {
  //     printGameState(game, false);
  //     console.log("Game over!");
  //     return;
  //   }

  //   game.additionalMetadata.lastUsedCards = characterToSelectedMoveMap;
  //   console.log();
  // }
};

// only print game state. do not update state
// function printGameState(
//   game: Game,
//   obfuscateInformation: boolean = true,
// ): void {
//   game.characters.forEach((character: Character) => {
//     printCharacter(character, obfuscateInformation);
//     if (character.skipTurn) {
//       console.log(`## ${character.name} skips this turn!`);
//     }
//   });
// }

// function printCharacter(
//   character: Character,
//   obfuscateInformation: boolean,
// ): void {
//   const charStat = character.stats.stats;
//   let hpInfo: string;
//   if (character.additionalMetadata.manaSuppressed && obfuscateInformation) {
//     hpInfo = "?? / ??";
//   } else {
//     hpInfo = `${charStat.HP}/${character.initialStats.stats.HP} ${percentBar(charStat.HP, character.initialStats.stats.HP)}`;
//   }
//   const lines = [
//     `# ${character.name}:`,
//     `- ${statDetails[StatsEnum.HP].emoji} **HP**: ${hpInfo}`,
//     `- ${statDetails[StatsEnum.ATK].emoji} **ATK**: ${charStat.ATK}`,
//     `- ${statDetails[StatsEnum.DEF].emoji} **DEF**: ${charStat.DEF}`,
//     `- ${statDetails[StatsEnum.SPD].emoji} **SPD**: ${charStat.SPD}`,
//     `- ${statDetails[StatsEnum.Ability].emoji} **Ability**: ${character.ability.abilityName} - ${charStat.Ability}`,
//     `  - ${character.ability.abilityEffectString}`,
//   ];
//   console.log(lines.join("\n"));
//   if (character.additionalMetadata.manaSuppressed) {
//     console.log(
//       `**Mana Suppression**: ${character.name} suppresses ${character.cosmetic.pronouns.possessive} mana - ${character.cosmetic.pronouns.possessive} HP is hidden.`,
//     );
//   }
//   if (character.additionalMetadata.teaTimeStacks) {
//     console.log(
//       `**Tea Time Snacks**: ${character.additionalMetadata.teaTimeStacks}`,
//     );
//   }
//   if (character.timedEffects.length > 0) {
//     console.log("**Timed effects:**");
//     character.timedEffects.forEach((effect) => {
//       effect.printEffect();
//     });
//   }
// }

// function checkGameOver(game: Game): boolean {
//   if (!game.gameOver) {
//     game.isGameOver();
//   }
//   if (game.gameOver) {
//     return true;
//   }

//   return false;
// }

// main();
