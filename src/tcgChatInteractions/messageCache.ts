import { TCGThread } from "./sendGameMessage";

export class MessageCache {
  public messages: Record<TCGThread, string[]> = {
    gameroom: [],
    challengerThread: [],
    opponentThread: [],
  };

  push(line: string, channel: TCGThread) {
    this.messages[channel].push(line);
  }

  join(channel: TCGThread) {
    this.messages[channel] = [this.messages[channel].join("\n")];
  }

  append(channelFrom: TCGThread, channelTo: TCGThread) {
    this.messages[channelTo].push(...this.messages[channelFrom]);
  }

  flush(channel: TCGThread): string[] {
    const messages = [...this.messages[channel]];
    this.messages[channel] = [];

    return messages;
  }
}
