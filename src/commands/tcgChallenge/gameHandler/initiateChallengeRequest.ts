import { ChatInputCommandInteraction } from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { handleOpponent } from "./utils/handleOpponent";
import { buildChallengeButtonRespond } from "./utils/buildChallengeButtonRespond";

export async function initiateChallengeRequest(prop: {
  interaction: ChatInputCommandInteraction;
  gameSettings: GameSettings;
  ranked: boolean;
  gamemode?: GameMode;
}): Promise<void> {
  const { interaction, gameSettings, ranked, gamemode } = prop;

  await interaction.deferReply();

  const challenger = interaction.user;
  const opponent = interaction.options.getUser("opponent");

  if (!(await handleOpponent(interaction, challenger, opponent))) {
    return;
  }

  return buildChallengeButtonRespond(
    interaction,
    challenger,
    opponent,
    gameSettings,
    ranked,
    gamemode
  );
}
