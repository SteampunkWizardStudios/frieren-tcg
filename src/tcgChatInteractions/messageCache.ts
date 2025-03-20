import { TCGThread } from "./sendGameMessage";

export class MessageCache {
  public messages: Record<TCGThread, string[]> = {
    gameroom: [],
    challengerThread: [],
    opponentThread: [],
  };

  pushAndLog(line: string, channel: TCGThread) {
    this.push(line, channel);
    console.log(line);
  }

  push(line: string, channel: TCGThread) {
    this.messages[channel].push(line);
  }

  flush(channel: TCGThread): string[] {
    const messages = [...this.messages[channel]];
    this.messages[channel] = [];

    return messages;
  }
}
