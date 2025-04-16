import {
  Interaction,
  InteractionType,
  InteractionContextType,
  ChannelType,
} from "discord.js";
import config from "@src/config";

export default function logInteraction(interaction: Interaction) {
  const displayName = interaction.user.displayName;
  const interactionType = InteractionType[interaction.type];
  const context = interaction.context
    ? InteractionContextType[interaction.context]
    : interaction.context;
  const channelType = interaction.channel?.type
    ? ChannelType[interaction.channel.type]
    : interaction.channel?.type;

  console.log(
    `${displayName} - Type: ${interactionType} Context: ${context} Channel Type: ${channelType}`
  );

  if (interaction.isChatInputCommand()) {
    const subcommand = interaction.options.getSubcommand(false) ?? "None";

    console.log(
      `Ran Command: ${interaction.commandName} Subcommand: ${subcommand}`
    );

    const options = interaction.options.data;
    if (config.logInteractions?.logCommandOptions && options.length > 0) {
      console.log(
        `Command Options: ${options
          .map((option) => {
            return `${option.name}: ${option.value}`;
          })
          .join(", ")}`
      );
    }
  } else if (interaction.isButton()) {
    console.log(`Pressed Button: ${interaction.customId}`);
  } else if (interaction.isAnySelectMenu()) {
    console.log(`Select Menu: ${interaction.customId}`);
  }
}
