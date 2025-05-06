import { Interaction } from "discord.js";
import { Middleware, NextMiddleware } from "@src/types/middleware";
import config from "@src/config";
import logInteraction from "@src/logInteractions";

/**
 * Middleware to log incoming interactions based on configuration.
 */
const logInteractionMiddleware: Middleware = async (
  interaction: Interaction,
  next: NextMiddleware
) => {
  if (config.logInteractions?.logInteractions) {
    logInteraction(interaction);
  }

  await next();
};

export default logInteractionMiddleware;
