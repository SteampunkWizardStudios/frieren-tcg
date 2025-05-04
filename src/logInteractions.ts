import {
  Interaction,
  InteractionType,
  InteractionContextType,
  ChannelType,
  ButtonInteraction,
  ModalSubmitInteraction,
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  type AnySelectMenuInteraction,
} from "discord.js";
import config from "@src/config";

/**
 * Logs details of a Discord interaction following a structured format.
 * @param interaction The Discord Interaction object.
 */
export default function logInteraction(interaction: Interaction) {
  const timestamp = new Date().toISOString();
  const userId = interaction.user.id;
  const userTag = interaction.user.tag;
  const interactionType = InteractionType[interaction.type] || "UnknownType";
  const context = interaction.context
    ? InteractionContextType[interaction.context] || "UnknownContext"
    : "N/A";

  // Determine channel info
  let channelInfo = "N/A";
  if (interaction.channel) {
    const channelType =
      ChannelType[interaction.channel.type] || "UnknownChannelType";
    channelInfo = `${channelType}`;
    if ("name" in interaction.channel && interaction.channel.name) {
      channelInfo += ` (${interaction.channel.name})`;
    }
    channelInfo += ` [${interaction.channel.id}]`;
  }

  let logMessage = `${timestamp} | INFO | User: ${userTag} (${userId}) | Type: ${interactionType} | Context: ${context} | Channel: ${channelInfo}`;

  if (interaction.isChatInputCommand()) {
    const commandName = interaction.commandName;
    const subcommandGroup =
      interaction.options.getSubcommandGroup(false) ?? null;
    const subcommand = interaction.options.getSubcommand(false) ?? null;

    logMessage += ` | Command: /${commandName}`;
    if (subcommandGroup) {
      logMessage += ` ${subcommandGroup}`;
    }
    if (subcommand) {
      logMessage += ` ${subcommand}`;
    }

    const options = interaction.options.data;
    if (config.logInteractions?.logCommandOptions && options.length > 0) {
      const optionDetails = options
        .map((option) => {
          // Attempt to log value safely, converting to string
          let valueString = "N/A";
          if (option.value !== undefined) {
            try {
              valueString = String(option.value);
              // Truncate long values to avoid excessive log size
              if (valueString.length > 100) {
                valueString = valueString.substring(0, 100) + "...";
              }
            } catch (e) {
              valueString = "Error Logging Value";
            }
          }
          return `${option.name}: ${valueString}`;
        })
        .join(", ");
      logMessage += ` | Options: { ${optionDetails} }`;
    }
  } else if (interaction.isButton()) {
    const buttonInteraction = interaction as ButtonInteraction;
    logMessage += ` | Button ID: ${buttonInteraction.customId}`;
  } else if (interaction.isAnySelectMenu()) {
    const selectMenuInteraction = interaction as AnySelectMenuInteraction;
    logMessage += ` | Select Menu ID: ${selectMenuInteraction.customId}`;
    const selectedValues = selectMenuInteraction.values.join(", ");
    logMessage += ` | Selected: [${selectedValues}]`;
  } else if (interaction.isModalSubmit()) {
    const modalInteraction = interaction as ModalSubmitInteraction;
    logMessage += ` | Modal ID: ${modalInteraction.customId}`;
    const modalValues = modalInteraction.fields.fields
      .map((field) => `${field.customId}: ${field.value}`)
      .join(", ");
    logMessage += ` | Fields: { ${modalValues} }`;
  } else if (interaction.isContextMenuCommand()) {
    const contextMenuInteraction = interaction as ContextMenuCommandInteraction;
    logMessage += ` | Context Menu Name: ${contextMenuInteraction.commandName}`;
    // Log target details if applicable (user, message)
    if (contextMenuInteraction.commandType) {
      logMessage += ` | Target Type: ${contextMenuInteraction.type}`;
      if (contextMenuInteraction.commandType === ApplicationCommandType.User) {
        logMessage += ` | Target User ID: ${contextMenuInteraction.targetId}`;
      } else if (
        contextMenuInteraction.commandType === ApplicationCommandType.Message
      ) {
        logMessage += ` | Target Message ID: ${contextMenuInteraction.targetId}`;
      }
    }
  }

  console.log(logMessage);
}
