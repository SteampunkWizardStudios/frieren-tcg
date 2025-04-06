import { AutocompleteInteraction, CommandInteraction } from "discord.js";

export interface Command<T extends CommandInteraction> {
  data: any; // SlashCommandBuilder or SlashCommandSubcommandBuilder
  execute: (interaction: T) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
