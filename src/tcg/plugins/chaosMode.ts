import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { GamePlugin } from "../gamePlugin";

export const EmpoweredMode: GamePlugin = {
  name: "Chaos Mode",

  modifyInitialStats(game) {
    // +20% HP to both players
    game.characters.forEach((char) => {
      char.stats.stats.HP = Number((char.stats.stats.HP * 1.2).toFixed(2));
      char.stats.startingHp;
    });
  },

  modifyDamage(game, baseDamage) {
    // Boost all damage by 10%
    return baseDamage * 1.1;
  },

  onGameStart(game) {
    game.messageCache.push(
      "# 🔥 Chaos Mode Activated: +20% HP, +10% Damage",
      TCGThread.Gameroom
    );
  },
};
