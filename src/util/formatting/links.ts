import {
  FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID,
  FRIEREN_DISCORD_SERVER,
} from "@src/constants";

export function buildThreadLink(threadId: string): string {
  return `https://discord.com/channels/${FRIEREN_DISCORD_SERVER}/${threadId}`;
}

export function buildMessageLink(messageId: string): string {
  return `https://discord.com/channels/${FRIEREN_DISCORD_SERVER}/${FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID}/${messageId}`;
}
