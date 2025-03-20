import { TextChannel, ThreadChannel } from "discord.js";

export enum TCGThread {
  Gameroom = "gameroom",
  ChallengerThread = "challengerThread",
  OpponentThread = "opponentThread",
}

export type TCGThreads = {
  [key in TCGThread]: ThreadChannel;
};

/**
 * Sends a game message to a specified TCG Thread. The client must be logged in before calling this function.
 *
 * @param {string} message - The message to send.
 * @param {TCGThread} thread - The thread to send the message to.
 * @param {TCGThreads} threadsMapping - mapping of thread to send the message to
 * @returns {Promise<boolean>} - A promise that resolves to true if the message was sent successfully, otherwise false.
 */
export async function sendToThread(
  messages: string[],
  thread: TCGThread,
  threadsMapping: TCGThreads,
  delay: number,
): Promise<boolean> {
  const targetThread = threadsMapping[thread];

  if (targetThread && targetThread instanceof ThreadChannel) {
    for (const message of messages) {
      // send message
      await targetThread.send(message);

      // add delay
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return true;
  }
  return false;
}
