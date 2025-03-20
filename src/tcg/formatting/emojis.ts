import { StatsEnum } from "../stats";

type StatInfo = {
  emoji: string;
};

export const statDetails: Record<StatsEnum, StatInfo> = {
  [StatsEnum.HP]: { emoji: "❤️" },
  [StatsEnum.ATK]: { emoji: "⚔️" },
  [StatsEnum.DEF]: { emoji: "🛡️" },
  [StatsEnum.SPD]: { emoji: "⚡" },
  [StatsEnum.Ability]: { emoji: "✨" },
};

export enum CardEmoji {
  HEART = "<:heartCard:1347328439627284560>",
  SHIELD = "<:shieldCard:1347328437618212974>",
  ENERGY = "<:energyCard:1347328442647187508>",
  DICE = "<:diceCard:1347328438683439137>",
  PUNCH = "<:punchCard:1347328441426640988>",
  HOURGLASS = "<:hourglassCard:1347328436192153600>",
  RANDOM = "<:randomCard:1347328434954571876>",
  GENERIC = "🃏",
  WAIT = "🕙",
  RECYCLE = "<:recycleCard:1347336609829490739>",

  FRIEREN = "<:FrierenCard:1347717556932317234>",
  SERIE = "<:SerieCard:1347718191136378961>",
  STILLE = "<:StilleCard:1347722643922751624>",
  LINIE = "<:LinieCard:1347719706164990065>",
  SEIN = "<:SeinCard:1347718390235791431>",
  STARK = "<:StarkCard:1347720915219124264>",
  LAUFEN = "<:LaufenCard:1347723068943892490>",

  FLOWER_FIELD = "<:FlowerFieldCard:1347719503290695803>",
}
