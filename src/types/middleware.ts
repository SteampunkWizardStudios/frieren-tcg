import { Interaction } from "discord.js";

export type NextMiddleware = () => Promise<void> | void;

// Takes the Interaction object and the next function in the chain
export type Middleware = (
  interaction: Interaction,
  next: NextMiddleware
) => Promise<void> | void;
