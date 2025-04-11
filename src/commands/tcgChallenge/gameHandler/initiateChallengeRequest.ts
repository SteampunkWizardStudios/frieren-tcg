import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { handleOpponent } from "./utils/handleOpponent";
import { buildChallengeButtonRespond } from "./utils/buildChallengeButtonRespond";
import config from "@src/config";

export async function initiateChallengeRequest(prop: {
  interaction: ChatInputCommandInteraction;
  gameSettings: GameSettings;
  ranked: boolean;
  gamemode?: GameMode;
}): Promise<void> {
  const { interaction, gameSettings, ranked, gamemode } = prop;
  if (config.maintenance) {
    await interaction.reply({
      content:
        "The game is currently under maintenance. New challenges are not allowed.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply();

  const challenger = interaction.user;
  const opponent = interaction.options.getUser("opponent");

  if (!(await handleOpponent(interaction, challenger, opponent, ranked))) {
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
