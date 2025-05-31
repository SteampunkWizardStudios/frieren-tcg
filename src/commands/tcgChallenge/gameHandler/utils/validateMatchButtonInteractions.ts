import { MessageComponentInteraction, MessageFlags, User } from "discord.js";
import config from "@src/config";
import {
  ACCEPT_BUTTON_ID,
  CANCEL_OPEN_INVITE_BUTTON_ID,
} from "@src/ui/challengeRequest";

export default function validateMatchButtonInteractions(
  i: MessageComponentInteraction,
  challenger: User,
  opponent: User | null,
  ranked: boolean
): boolean {
  if (config.maintenance) {
    i.reply({
      content:
        "The game is currently under maintenance. New games are not allowed.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (opponent && i.user.id !== opponent.id) {
    i.reply({
      content: "You are not the opponent of this challenge request.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (
    i.customId === CANCEL_OPEN_INVITE_BUTTON_ID &&
    i.user.id !== challenger.id
  ) {
    i.reply({
      content: "You are not the initiator of this open invite.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  } else if (
    i.customId === ACCEPT_BUTTON_ID &&
    i.user.id === challenger.id &&
    ranked
  ) {
    i.reply({
      content: "You cannot accept your own open invite for ranked matches.",
      flags: MessageFlags.Ephemeral,
    });
    return false;
  }
  return true;
}
