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
import { GameMode, GameSettings } from "../gameSettings";
import { initiateGame } from "../initiateGame";

const ACCEPT_BUTTON_ID = "tcg-accept";
const DECLINE_BUTTON_ID = "tcg-decline";
const CANCEL_OPEN_INVITE_BUTTON_ID = "tcg-open-invite-cancel";

export const buildChallengeButtonRespond = async (
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User | null,
  gameSettings: GameSettings,
  ranked: boolean,
  gameMode?: GameMode
) => {
  const acceptButton = new ButtonBuilder()
    .setCustomId(ACCEPT_BUTTON_ID)
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success);

  const declineButton = opponent
    ? new ButtonBuilder()
        .setCustomId(DECLINE_BUTTON_ID)
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    : new ButtonBuilder()
        .setCustomId(CANCEL_OPEN_INVITE_BUTTON_ID)
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    acceptButton,
    declineButton
  );

  const inviteType = opponent ? "Challenge Request" : "Open Invite";

  const embed = new EmbedBuilder()
    .setTitle(`Frieren TCG - ${ranked ? "Ranked" : ""} ${inviteType}`)
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
        name: "Reveal Active Cards",
        value: gameSettings.revealDraw ? "Yes" : "No",
        inline: true,
      }
    )
    .setColor(0xc5c3cc)
    .setTimestamp();

  const description = opponent
    ? `${opponent}, ${challenger} has challenged you to a${ranked ? "** Ranked **" : " "}TCG duel`
    : `${challenger} has sent an open invite for a${ranked ? "** Ranked **" : " "}TCG duel`;

  embed.setDescription(description);

  await interaction.editReply({
    embeds: [embed],
    components: [row],
  });

  const response = await interaction.fetchReply();

  if (response) {
    const collector = response.createMessageComponentCollector({
      time: 120_000, // 2 minutes timeout
      filter: (i) => {
        if (opponent && i.user.id !== opponent.id) {
          const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
            "You are not the opponent of this challenge request."
          );
          i.reply({
            embeds: [invalidUserEmbed],
            flags: MessageFlags.Ephemeral,
          });
          return false;
        } else if (
          i.customId === CANCEL_OPEN_INVITE_BUTTON_ID &&
          i.user.id !== challenger.id
        ) {
          const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
            "You are not the initiator of this open invite."
          );

          i.reply({
            embeds: [invalidUserEmbed],
            flags: MessageFlags.Ephemeral,
          });
          return false;
        } else if (
          i.customId === ACCEPT_BUTTON_ID &&
          i.user.id === challenger.id &&
          ranked
        ) {
          const invalidUserEmbed = EmbedBuilder.from(embed).setDescription(
            "You cannot accept your own open invite for ranked matches."
          );

          i.reply({
            embeds: [invalidUserEmbed],
            flags: MessageFlags.Ephemeral,
          });
          return false;
        }
        return true;
      },
    });

    // handle button clicks
    collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
      if (buttonInteraction.customId === ACCEPT_BUTTON_ID) {
        const acceptMessage = opponent
          ? `Challenge accepted by ${opponent}! Setting up the game...`
          : `Open invite accepted by ${buttonInteraction.user}! Setting up the game...`;

        const challengeAcceptedEmbed =
          EmbedBuilder.from(embed).setDescription(acceptMessage);

        await buttonInteraction.update({
          embeds: [challengeAcceptedEmbed],
          components: [],
        });

        // start game
        await initiateGame(
          interaction,
          response.id,
          challenger,
          opponent ?? buttonInteraction.user,
          gameSettings,
          ranked,
          gameMode
        );
      } else if (buttonInteraction.customId === DECLINE_BUTTON_ID) {
        const challengeDeclinedEmbed = EmbedBuilder.from(embed).setDescription(
          `Challenge declined by ${opponent}!`
        );

        return await buttonInteraction.update({
          embeds: [challengeDeclinedEmbed],
          components: [],
        });
      } else if (buttonInteraction.customId === CANCEL_OPEN_INVITE_BUTTON_ID) {
        const cancelMessage = `${challenger} has cancelled their open invite.`;

        const cancelEmbed =
          EmbedBuilder.from(embed).setDescription(cancelMessage);

        return await buttonInteraction.update({
          embeds: [cancelEmbed],
          components: [],
        });
      }
    });

    // Handle collector end (timeout)
    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        const timeoutMessage = opponent
          ? `Challenge request expired. ${opponent} did not respond in time.`
          : `Open invite expired. Nobody accepted the invite in time.`;

        const timeoutEmbed =
          EmbedBuilder.from(embed).setDescription(timeoutMessage);

        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: [],
        });
      }
    });
  }
};
