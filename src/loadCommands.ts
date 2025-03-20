import { CommandInteraction } from "discord.js";
import { Command } from "./types/command";
import * as fs from "fs";
import * as path from "path";

export const loadCommands = async (
  dir: string,
): Promise<Record<string, Command<CommandInteraction>>> => {
  const commands: Record<string, Command<CommandInteraction>> = {};

  async function loadCommandsRecursive(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        await loadCommandsRecursive(filePath);
      } else if (file.endsWith(".ts")) {
        const commandModule = await import(filePath);
        if (commandModule.command) {
          const command = commandModule.command;
          commands[command.data.name] = command;
          console.log(`Loaded command: ${command.data.name} from ${filePath}`);
        }
      }
    }
  }

  await loadCommandsRecursive(dir);
  console.log(`Loaded ${Object.keys(commands).length} commands`);

  return commands;
};
