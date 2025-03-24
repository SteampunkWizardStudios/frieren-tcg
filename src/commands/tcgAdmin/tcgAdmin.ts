// import {
//   SlashCommandBuilder,
//   ChatInputCommandInteraction,
//   MessageFlags,
//   InteractionContextType,
// } from "discord.js";
// import type { Command } from "../../types/command";
// import { readFile, writeFile } from "fs/promises";
// import path from "path";
// import { characterSelectState } from "../../tcg/characters/characterList";

// export const command: Command<ChatInputCommandInteraction> = {
//   data: new SlashCommandBuilder()
//     .setName("tcg-admin")
//     .setDescription("Admin commands for TCG game")
//     .setContexts([InteractionContextType.Guild])
//     .addSubcommand((subcommand) =>
//       subcommand
//         .setName("adjust-stat")
//         .setDescription("Adjust a character's stats")
//         .addStringOption((option) =>
//           option
//             .setName("character")
//             .setDescription("Character to adjust")
//             .setRequired(true)
//             .addChoices(
//               { name: "Sein", value: "Sein" },
//               { name: "Serie", value: "Serie" },
//             ),
//         )
//         .addStringOption((option) =>
//           option
//             .setName("stat")
//             .setDescription("Stat to adjust")
//             .setRequired(true)
//             .addChoices(
//               { name: "CurrHP", value: "currHp" },
//               { name: "MaxHP", value: "maxHp" },
//               { name: "ATK", value: "atk" },
//               { name: "DEF", value: "def" },
//               { name: "SPD", value: "spd" },
//             ),
//         )
//         .addNumberOption((option) =>
//           option
//             .setName("adjustment-value")
//             .setDescription("Value to adjust by")
//             .setRequired(true),
//         ),
//     )
//     .addSubcommand((subcommand) =>
//       subcommand
//         .setName("toggle-sein-serie")
//         .setDescription("Toggles whether Sein and Serie is available to use.")
//         .addBooleanOption((option) =>
//           option
//             .setName("available")
//             .setDescription("Whether Sein and Serie is available to use.")
//             .setRequired(true),
//         ),
//     ),

//   async execute(interaction: ChatInputCommandInteraction) {
//     const subcommand = interaction.options.getSubcommand();

//     try {
//       switch (subcommand) {
//         case "adjust-stat":
//           const character = interaction.options.getString(
//             "character",
//           ) as string;
//           const stat = interaction.options.getString("stat") as string;
//           const value = interaction.options.getNumber(
//             "adjustment-value",
//           ) as number;

//           // Read current stats
//           const jsonPath =
//             "../../tcg/characters/characterData/characters/characterStats.json";
//           const statsPath = path.join(__dirname, jsonPath);
//           const statsRaw = await readFile(statsPath, "utf8");
//           let stats = JSON.parse(statsRaw);

//           // Update stats and write back
//           stats[character][stat] += value;
//           await writeFile(statsPath, JSON.stringify(stats, null, 2));

//           // delete cache
//           delete require.cache[require.resolve(jsonPath)];

//           await interaction.reply({
//             content: `Updated ${character}'s ${stat} to ${stats[character][stat]}`,
//             flags: MessageFlags.Ephemeral,
//           });
//         case "toggle-sein-serie":
//           const available = interaction.options.getBoolean("available", true);
//           characterSelectState.isSeinSerieEnabled = available;
//           await interaction.reply({
//             content: `${available ? "Enabled" : "Disabled"} Sein & Serie selection.`,
//             flags: MessageFlags.Ephemeral,
//           });
//       }
//     } catch (error) {
//       console.log(error);
//       await interaction.reply({
//         content: "Interaction failed.",
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   },
// };
