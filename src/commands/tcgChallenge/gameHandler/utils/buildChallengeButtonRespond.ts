import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  User,
} from "discord.js";
import { GameSettings } from "../gameSettings";
import { initiateGame } from "../initiateGame";

const ACCEPT_BUTTON_ID = "tcg-accept";
const DECLINE_BUTTON_ID = "tcg-decline";

export const buildChallengeButtonRespond = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User,
  gameSettings: GameSettings,
  ranked: boolean,
) => {
  const acceptButton = new ButtonBuilder()
    .setCustomId(ACCEPT_BUTTON_ID)
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const declineButton = new ButtonBuilder()
    .setCustomId(DECLINE_BUTTON_ID)
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    acceptButton,
    declineButton,
  );

  const embed = new EmbedBuilder()
    .setTitle(`Frieren TCG - ${ranked ? "Ranked " : ""}Challenge Request`)
    .setDescription(
      `${opponent}, ${challenger} has challenged you to a ${ranked ? "**Ranked** " : ""}TCG duel`,
    )
    .addFields(
      {
        name: "Turn Duration",
        value: `${gameSettings.turnDurationSeconds} seconds`,
        inline: true,
      },
      {
        name: "Reveal Hand",
        value: gameSettings.revealHand ? "Yes" : "No",
        inline: true,
      },
      {
        name: "Reveal Draw",
        value: gameSettings.revealDraw ? "Yes" : "No",
        inline: true,
      },
    )
    .setColor(0xc5c3cc)
    .setTimestamp();

  await interaction.reply({
    embeds: [embed],
    components: [row],
    withResponse: true,
  });

  const response = await interaction.fetchReply();

  if (response) {
    const collector = response.createMessageComponentCollector({
      time: 120_000, // 2 minutes timeout
      filter: (i) => {
        if (i.user.id !== opponent.id) {
          const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
            "You are not the opponent of this challenge request.",
          );
          i.reply({
            embeds: [invalidUserEmbed],
            ephemeral: true,
          });
          return false;
        }
        return true;
      },
    });

    // handle button clicks
    collector.on("collect", async (i: ButtonInteraction) => {
      if (i.customId === ACCEPT_BUTTON_ID) {
        const challengeAcceptedEmbed = EmbedBuilder.from(embed).setDescription(
          `Challenge accepted by ${interaction.user}! Setting up game...`,
        );
        await i.update({
          embeds: [challengeAcceptedEmbed],
          components: [],
        });

        // start game
        await initiateGame(i, challenger, opponent, gameSettings, ranked);
      } else if (i.customId === DECLINE_BUTTON_ID) {
        const challengeDeclinedEmbed = EmbedBuilder.from(embed).setDescription(
          `Challenge declined by ${interaction.user}!`,
        );

        return await i.update({
          embeds: [challengeDeclinedEmbed],
          components: [],
        });
      }
    });

    // Handle collector end (timeout)
    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        const timeoutEmbed = EmbedBuilder.from(embed).setDescription(
          `Challenge request expired. ${opponent} did not respond in time.`,
        );

        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: [],
        });
      }
    });
  }
};
