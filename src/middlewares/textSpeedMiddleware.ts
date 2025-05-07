import { Interaction } from "discord.js";
import { Middleware, NextMiddleware } from "@src/types/middleware";
import { updateTcgTextSpeed } from "@src/util/db/preferences";
import { getPlayer } from "@src/util/db/getPlayer";

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
        const player = await getPlayer(interaction.user.id);

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
