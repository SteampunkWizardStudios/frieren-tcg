import { FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID } from "@src/constants";

export function buildThreadLink(threadId: string): string {
  return `https://discord.com/channels/${FRIEREN_DISCORD_SERVER_AUBERST_CHANNEL_ID}/${threadId}`;
}
