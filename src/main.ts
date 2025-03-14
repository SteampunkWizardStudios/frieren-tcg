import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const commands = [
  new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true),
    ),
];

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;

const rest = new REST({ version: "10" }).setToken(token);

const client = new Client({
  intents: [],
});

async function main() {
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
  } catch (error) {
    console.error(error);
  }

  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'echo') {
      const input = interaction.options.getString('input');
      await interaction.reply(input ?? "No input");
    }
  });

  await client.login(token);
}

main();
