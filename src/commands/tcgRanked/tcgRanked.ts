import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import type { Command } from "../../types/command";
import handlePlayerStats from "./rankedHandlers/playerStats";
import {
  GAME_SETTINGS,
  GameMode,
} from "../tcgChallenge/gameHandler/gameSettings";
import { CHARACTER_LIST } from "@src/tcg/characters/characterList";
import {
  getTop5PlayersInGamemode,
  getTop5PlayersPerCharacter,
} from "./rankedHandlers/globalStats";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-ranked")
    .setDescription("Get stats for TCG ranked games")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("player")
        .setDescription("Get ranked stats for a player, defaults to yourself")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to get ranked stats for")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("global")
        .setDescription("Get global ranked stats")
        .addStringOption((option) =>
          option
            .setName("gamemode")
            .setDescription(
              "Select the gamemode to get stats for. Defaults to Classic."
            )
            .setRequired(false)
            .addChoices(
              Object.entries(GAME_SETTINGS)
                .filter(([, game]) => game.optionName && game.allowedOption)
                .map(([key, game]) => ({
                  name: game.optionName ?? "optionName should be defined",
                  value: key,
                }))
            )
        )
        .addStringOption((option) =>
          option
            .setName("character")
            .setDescription("Select the character to get stats for")
            .setRequired(false)
            .addChoices(
              Object.entries(CHARACTER_LIST).map(([key, character]) => ({
                name: character.name,
                value: character.name.toLowerCase(),
              }))
            )
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      switch (subcommand) {
        case "player": {
          await handlePlayerStats(interaction);
        }
        case "global":
          const gamemode: GameMode =
            (interaction.options.getString("gamemode") as GameMode) ??
            GameMode.CLASSIC;

          const character = interaction.options.getString("character");
          if (character) {
            const top = await getTop5PlayersPerCharacter(gamemode);
            const topForCharacter = top[character];

            const embed = new EmbedBuilder()
              .setColor("Blurple")
              .setTitle(`${gamemode} Ranked Top 5 Players for ${character}`)
              .setDescription(
                topForCharacter
                  .map((player) => `${player.discordId}: ${player.rankPoints}`)
                  .join("\n")
              );

            await interaction.editReply({
              embeds: [embed],
            });
          } else {
            const top = await getTop5PlayersInGamemode(gamemode);

            const embed = new EmbedBuilder()
              .setColor("Blurple")
              .setTitle(`${gamemode} Ranked Top 5 Players`)
              .setDescription(
                top
                  .map(
                    (player) =>
                      `${player.player.discordId}: ${player.rankPoints}`
                  )
                  .join("\n")
              );

            await interaction.editReply({
              embeds: [embed],
            });
          }
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "tcg-ranked failed",
      });
    }
  },
};
