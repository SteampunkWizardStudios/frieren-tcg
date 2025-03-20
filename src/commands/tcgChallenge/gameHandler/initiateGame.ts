import { ButtonInteraction, User } from "discord.js";
import { GameSettings } from "./gameSettings";

export const initiateGame = async (
  interaction: ButtonInteraction,
  challenger: User,
  opponent: User,
  gameSettings: GameSettings,
  ranked: boolean,
) => {
  console.log(interaction);
  console.log(challenger.username);
  console.log(opponent.username);
  console.log(gameSettings.turnDurationSeconds);
  console.log(gameSettings.revealHand);
  console.log(gameSettings.revealDraw);
  console.log(ranked);
};
