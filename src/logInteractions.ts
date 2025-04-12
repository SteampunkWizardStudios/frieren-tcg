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
    : "unknown";
  const channelType = interaction.channel?.type
    ? ChannelType[interaction.channel.type]
    : "unknown";

  console.log(
    `${displayName} - Type: ${interactionType} Context: ${context} Channel Type: ${channelType}`
  );

  if (interaction.isChatInputCommand()) {
    const subcommand = interaction.options.getSubcommand(false) ?? "None";

    console.log(
      `Ran Command: ${interaction.commandName} Subcommand: ${subcommand}`
    );

    if (config.logInteractions?.logCommandOptions) {
      console.log(
        `Command Options: ${interaction.options.data
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
