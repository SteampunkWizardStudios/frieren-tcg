import { CommandInteraction, REST, Routes } from "discord.js";
import { Command } from "./types/command";

export const registerCommands = async (
  token: string,
  clientId: string,
  commands: Record<string, Command<CommandInteraction>>,
  guildId?: string,
) => {
  const rest = new REST({ version: "10" }).setToken(token);

  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  // unregister then re-register all commands only on Prod - avoiding accidental unregister while on dev
  if (process.env.NODE_ENV === "production") {
    unregisterAllCommands(rest, clientId, guildId);
    console.log("Unregistered previous commands");
  }

  await rest.put(route, {
    body: Object.values(commands).map((cmd) => cmd.data.toJSON()),
  });
  console.log(`Registered ${Object.keys(commands).length} commands`);
};

export const unregisterAllCommands = async (
  rest: REST,
  clientId: string,
  guildId?: string,
) => {
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: [],
    });
  }
  await rest.put(Routes.applicationCommands(clientId), { body: [] });
};
