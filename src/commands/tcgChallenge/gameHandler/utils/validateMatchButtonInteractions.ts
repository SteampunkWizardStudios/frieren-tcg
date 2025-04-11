import {
  MessageComponentInteraction,
  EmbedBuilder,
  MessageFlags,
  User,
} from "discord.js";
import config from "@src/config";
import {
  ACCEPT_BUTTON_ID,
  CANCEL_OPEN_INVITE_BUTTON_ID,
} from "./buildChallengeButtonRespond";

export default function validateMatchButtonInteractions(
  i: MessageComponentInteraction,
  challenger: User,
  opponent: User | null,
  ranked: boolean,
  embed: EmbedBuilder
): boolean {
  if (config.maintenance) {
    const maintenanceMessage = EmbedBuilder.from(embed).setDescription(
      "The game is currently under maintenance. New games are not allowed."
    );
    i.reply({
      embeds: [maintenanceMessage],
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (opponent && i.user.id !== opponent.id) {
    const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
      "You are not the opponent of this challenge request."
    );
    i.reply({
      embeds: [invalidUserEmbed],
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (
    i.customId === CANCEL_OPEN_INVITE_BUTTON_ID &&
    i.user.id !== challenger.id
  ) {
    const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
      "You are not the initiator of this open invite."
    );

    i.reply({
      embeds: [invalidUserEmbed],
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (
    i.customId === ACCEPT_BUTTON_ID &&
    i.user.id === challenger.id &&
    ranked
  ) {
    const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
      "You cannot accept your own open invite for ranked matches."
    );

    i.reply({
      embeds: [invalidUserEmbed],
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}
