import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import type { Command } from "../../types/command";
import prismaClient from "@prismaClient";

export const command: Command<ChatInputCommandInteraction> = {
  data: new SlashCommandBuilder()
    .setName("tcg-profile")
    .setDescription("Get a TCG player profile")
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .addUserOption((option) =>
      option
        .setName("player")
        .setDescription(
          "The player to get the profile of, defaults to yourself"
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    try {
      await handlePlayerProfile(interaction);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Interaction failed.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

async function handlePlayerProfile(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const player = interaction.options.getUser("player") ?? interaction.user;

  const dbPlayer = await prismaClient.player.findUnique({
    where: {
      discordId: player.id,
    },
    select: {
      achievements: true,
    },
  });

  if (!dbPlayer) {
    await interaction.editReply({
      content: `No profile found for ${player}`,
    });
    return;
  }

  const achievementMap = dbPlayer.achievements.map((achievement) => {
    const { name, description } = achievement;
    let achText = `${name}\n`;
    if (description) {
      achText += `${description}\n`;
    }
    return achText;
  });

  const description =
    "**Achievements**:\n" +
    (achievementMap.length > 0
      ? achievementMap.join("\n")
      : "This player has no achievements");
  const embed = new EmbedBuilder()
    .setTitle(`${player.username}'s Profile`)
    .setColor("Blurple")
    .setDescription(description);

  await interaction.editReply({
    embeds: [embed],
  });
}
