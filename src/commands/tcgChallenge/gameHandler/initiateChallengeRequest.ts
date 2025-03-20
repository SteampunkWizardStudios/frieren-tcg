import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { statDetails } from "../../../tcg/formatting/emojis";
import { GameSettings } from "./gameSettings";
import { handleOpponent } from "./utils/handleOpponent";
import { buildChallengeButtonRespond } from "./utils/buildChallengeButtonRespond";

export async function initiateChallengeRequest(
  interaction: ChatInputCommandInteraction,
  gameSettings: GameSettings,
  ranked: boolean,
) {
  const challenger = interaction.user;
  const opponent = interaction.options.getUser("opponent")!;
  if (!handleOpponent(interaction, challenger, opponent)) {
    return;
  }
  return buildChallengeButtonRespond(
    interaction,
    challenger,
    opponent,
    gameSettings,
    ranked,
  );
}
