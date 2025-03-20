import { CommandInteraction } from "discord.js";
import { Command } from "./types/command";
import * as fs from "fs";
import * as path from "path";

export const loadCommands = async (
  dir: string,
): Promise<Command<CommandInteraction>[]> => {
  const commands: Command<CommandInteraction>[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      commands.push(...(await loadCommands(filePath)));
    } else if (file.endsWith(".ts")) {
      const commandModule = await import(filePath);
      if (commandModule.command) {
        commands.push(commandModule.command);
      }
    }
  }

  console.log(`Fouund ${commands.length} commands.`);

  return commands;
};
