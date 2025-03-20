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

export enum CharacterEmoji {
  FRIEREN = "<:Frieren3:790429364570423346>",
  SENSE = "<:SenseStare:1204637493077610546>",
  SERIE = "<:SerieHowCute:1346583513297850398>",
  STILLE = "🐦‍🔥",
  LINIE = "<:LinieBaka:1343985694351032393>",
  SEIN = "<:SeinCool:1189748661287137370>",
  STARK = "<:StarkPoint:1165025263747342386>",
  LAUFEN = "<:LaufenNom:1198338042449113190>",
}

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

  FRIEREN_CARD = "<:FrierenCard:1347717556932317234>",
  SERIE_CARD = "<:SerieCard:1347718191136378961>",
  STILLE_CARD = "<:StilleCard:1347722643922751624>",
  LINIE_CARD = "<:LinieCard:1347719706164990065>",
  SEIN_CARD = "<:SeinCard:1347718390235791431>",
  STARK_CARD = "<:StarkCard:1347720915219124264>",
  LAUFEN_CARD = "<:LaufenCard:1347723068943892490>",

  FLOWER_FIELD = "<:FlowerFieldCard:1347719503290695803>",
}
