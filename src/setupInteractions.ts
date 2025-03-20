import { Client, CommandInteraction, MessageFlags } from "discord.js";
import { Command } from "./types/command";

export const setupInteractions = async (
  client: Client,
  commands: Command<CommandInteraction>[],
) => {
  // Set up command handling
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(
      (cmd) => cmd.data.name === interaction.commandName,
    );
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing this command",
        flags: MessageFlags.Ephemeral,
      });
    }
  });
};
