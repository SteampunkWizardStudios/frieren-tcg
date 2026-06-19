import {
  ActionRowBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  ContainerBuilder,
  StringSelectMenuBuilder,
} from "discord.js";

export const sendInfoMessage = async (
  interaction: ChatInputCommandInteraction,
  embed: EmbedBuilder,
  components?: ActionRowBuilder<StringSelectMenuBuilder>[]
) => {
  if (interaction.channel?.type === ChannelType.DM) {
    await interaction.reply({
      content: `Sending DM...`,
      flags: MessageFlags.Ephemeral,
    });

    if (!interaction.user.dmChannel) {
      return await interaction.editReply({
        content: `Could not find DM channel. Please check your privacy settings.`,
      });
    }

    return await interaction.user
      .send({ embeds: [embed], components: components })
      .catch(async (error) => {
        console.log(error);
        await interaction.editReply({
          content: `Failed to send DM.`,
        });
      });
  } else {
    return await interaction.reply({
      embeds: [embed],
      components: components,
      flags: MessageFlags.Ephemeral,
    });
  }
};

export const sendInfoContainer = async (
  interaction: ChatInputCommandInteraction,
  container: ContainerBuilder
) => {
  const isDM = interaction.channel?.type === ChannelType.DM;
  const flags = isDM
    ? ([MessageFlags.IsComponentsV2] as const)
    : ([MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] as const);

  return await interaction.reply({
    components: [container],
    flags,
  });
};
