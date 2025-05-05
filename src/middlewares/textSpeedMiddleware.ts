import { Interaction } from "discord.js";
import { Middleware, NextMiddleware } from "../types/middleware";
import { updateTcgTextSpeed } from "@src/util/db/preferences";
import prismaClient from "@prismaClient";

/**
 * Middleware to update the player's TCG text speed preference
 * if the 'set-text-speed' command is used.
 */
const textSpeedMiddleware: Middleware = async (
  interaction: Interaction,
  next: NextMiddleware
) => {
  if (interaction.isChatInputCommand()) {
    try {
      const speed = interaction.options.getInteger("text_speed_ms");
      if (speed) {
        const player = await prismaClient.player.upsert({
          where: {
            discordId: interaction.user.id,
          },
          update: {},
          create: {
            discordId: interaction.user.id,
          },
        });

        updateTcgTextSpeed(player.id, speed);
      }
    } catch (error) {
      console.error("Error in textSpeedMiddleware:", error);
      throw error;
    }
  }

  await next();
};

export default textSpeedMiddleware;
