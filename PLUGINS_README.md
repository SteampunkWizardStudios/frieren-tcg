# 🧩 Game Plugins System

The `Game` class supports a flexible plugin system that allows you to hook into game events and modify behavior. This makes it easy to add custom rules, effects, or chaotic modifiers without touching the core logic.

---

## How to Use Plugins

### Step 1: Implement a Plugin

Create a file like `myCustomPlugin.ts`:

```ts
import { GamePlugin } from "./plugins/GamePlugin";
import { TCGThread } from "../tcgChatInteractions/sendGameMessage";

export const MyCustomPlugin: GamePlugin = {
  onGameStart(game) {
    game.messageCache.push(
      "# A mysterious power lingers in the air...",
      TCGThread.Gameroom
    );
  },
  modifyDamage(game, damage, attackerIndex, defenderIndex) {
    return damage * 1.5; // 50% extra damage!
  },
};
```

### Step 2: Pass Plugins to the Game

When creating a new game, include the plugin(s):

```ts
const game = new Game([player1, player2], messageCache, [MyCustomPlugin]);
```

You can pass in any number of plugins as an array.

---

## Available Plugin Hooks

| Hook                                                  | Description                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `onGameStart(game)`                                   | Called when the game starts. Great for initialization or announcements. |
| `onTurnStart(game, turn)`                             | Runs at the start of each turn. Use for timed effects or random events. |
| `modifyInitialStats(game)`                            | Modify character stats like HP/ATK/DEF before game starts.              |
| `modifyCardDraw(game, index, base)`                   | Customize how many cards a character draws.                             |
| `modifyDamage(game, dmg, attacker, defender)`         | Change how much damage is dealt before it's applied.                    |
| `onAttackComplete(game, attackerIndex, actualDamage)` | Trigger effects after an attack is resolved.                            |
| `onCharacterDefeated(game, defeatedIndex)`            | Called when a character is defeated. Perfect for revenge mechanics.     |

---

## Example Plugins

### Double Draw Plugin

```ts
export const DoubleDrawPlugin: GamePlugin = {
  modifyCardDraw(game, index, base) {
    return base + 1;
  },
};
```

### Random HP Swap

```ts
export const RandomHpSwapPlugin: GamePlugin = {
  onTurnStart(game) {
    if (Math.random() < 0.5) {
      const [a, b] = game.characters;
      [a.stats.stats.HP, b.stats.stats.HP] = [
        b.stats.stats.HP,
        a.stats.stats.HP,
      ];
      game.messageCache.push(
        "# HP values suddenly swapped!",
        TCGThread.Gameroom
      );
    }
  },
};
```
