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
  console.log(member.roles);
  return await guild.members.fetch(discordId);
}

export async function getDiscordServer(client: Client) {
  return client.guilds.cache.get(`1358247805793210368`); // TODO: change to constant
}
