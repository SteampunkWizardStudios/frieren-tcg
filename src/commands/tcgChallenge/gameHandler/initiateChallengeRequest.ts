import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { GameMode, GameSettings } from "./gameSettings";
import { handleOpponent } from "./utils/handleOpponent";
import { buildChallengeButtonRespond } from "./utils/buildChallengeButtonRespond";
import config from "@src/config";
import prismaClient from "@prismaClient";
import { getPlayerPreferences } from "@src/util/db/preferences";
import { DEFAULT_TEXT_SPEED } from "@src/constants";

export async function initiateChallengeRequest(prop: {
  interaction: ChatInputCommandInteraction;
  gameSettings: GameSettings;
  ranked: boolean;
  textSpeedMs: number | null;
  gamemode?: GameMode;
}): Promise<void> {
  const { interaction, gameSettings, ranked, gamemode, textSpeedMs } = prop;
  if (config.maintenance) {
    await interaction.reply({
      content:
        "The game is currently under maintenance. New challenges are not allowed.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  let preferredTextSpeed = textSpeedMs;
  if (!preferredTextSpeed) {
    const player = await prismaClient.player.upsert({
      where: {
        discordId: interaction.user.id,
      },
      update: {},
      create: {
        discordId: interaction.user.id,
      },
    });
    const playerPreferences = await getPlayerPreferences(player.id);
    preferredTextSpeed = playerPreferences
      ? playerPreferences.tcgTextSpeed
      : DEFAULT_TEXT_SPEED;
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
    preferredTextSpeed,
    gamemode
  );
}
