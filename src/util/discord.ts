import { FRIEREN_DISCORD_SERVER } from "@src/constants";
import type { Client, GuildMember } from "discord.js";
export async function getMemberFromDiscordId(
  client: Client,
  discordId: string
): Promise<GuildMember> {
  const guild = await getDiscordServer(client);
  if (!guild) {
    throw new Error("Frieren discord server not found");
  }

  const member = await guild.members.fetch(discordId);
  return member;
}

export async function getDiscordServer(client: Client) {
  return client.guilds.cache.get(FRIEREN_DISCORD_SERVER);
}
