import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { manaConcealment } from "./FernDeck";
import mediaLinks from "@tcg/formatting/mediaLinks";

export const a_hairWhip = new Card({
  title: "Hair Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) => `DEF+${def}. Afterwards, DMG ${dmg}+DEF/4.`,
  effects: [3, 7],
  hpCost: 4,
  emoji: CardEmoji.PUNCH,
  cardAction: ({
    name,
    selfStats,
    possessive,
    selfStat,
    flatAttack,
    sendToGameroom,
    calcEffect,
  }) => {
    sendToGameroom(`${name} whipped ${possessive} hair!`);

    selfStat(0, StatsEnum.DEF);

    const damage = calcEffect(1) + selfStats.DEF / 4;
    flatAttack(damage);
  },
});

export const sharpen = new Card({
  title: "Sharpen",
  cardMetadata: { nature: Nature.Util },
  description: ([def, atk, spd]) => `DEF+${def}. ATK+${atk}. SPD+${spd}`,
  effects: [1, 2, 2],
  hpCost: 3,
  emoji: CardEmoji.PUNCH,
  cardAction: ({ name, possessive, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} sharpened ${possessive} hair drills!`);

    selfStat(0, StatsEnum.DEF);
    selfStat(1, StatsEnum.ATK);
    selfStat(2, StatsEnum.SPD);
  },
});

export const a_pierce = new Card({
  title: "Pierce",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) =>
    `DEF+${def}. Afterwards, DMG ${dmg} + (DEF/4). Pierces through 1/4 of the opponent's defense.`,
  effects: [1, 10],
  hpCost: 7,
  emoji: CardEmoji.PUNCH,
  cardAction: ({
    name,
    selfStats,
    sendToGameroom,
    selfStat,
    flatAttack,
    calcEffect,
  }) => {
    sendToGameroom(`${name} pierced the opponent!`);

    selfStat(0, StatsEnum.DEF);

    const damage = calcEffect(1) + selfStats.DEF / 4;
    flatAttack(damage, 0.25);
  },
});

export const hairBarrier = new Card({
  title: "Hair Barrier",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  effects: [20],
  emoji: CardEmoji.HOURGLASS,
  priority: 2,
  cosmetic: {
    cardGif: mediaLinks.sense_hairBarrier_gif,
  },
  cardAction: ({
    self,
    name,
    possessive,
    reflexive,
    selfStat,
    sendToGameroom,
    calcEffect,
    selfEffect,
  }) => {
    sendToGameroom(
      `${name} surrounded ${reflexive} in ${possessive} hair barrier!`
    );

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF);

    selfEffect({
      name: "Hair Barrier",
      description: `Increases TrueDEF by ${def} until the end of the turn.`,
      priority: -1,
      turnDuration: 1,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: (game, _characterIndex) => {
        self.adjustStat(-1 * def, StatsEnum.TrueDEF, game);
      },
    });
  },
});

export const teaTime = new Card({
  title: "Tea Time",
  cardMetadata: { nature: Nature.Util, teaTime: 1 },
  description: ([hp]) => `Heal ${hp}. Gain 1 Tea Time snack.`,
  effects: [7],
  emoji: CardEmoji.HEART,
  cosmetic: {
    cardGif: mediaLinks.sense_teaTime_gif,
  },
  cardAction: ({ name, selfStat, sendToGameroom }) => {
    sendToGameroom(`${name} enjoyed a refreshing cup of tea.`);
    selfStat(0, StatsEnum.HP);
  },
});

export const teaParty = new Card({
  title: "Tea Party",
  cardMetadata: { nature: Nature.Util, teaTime: 2 },
  description: ([hp]) => `Heal ${hp}. Gain 2 Tea Time snacks.`,
  effects: [10],
  emoji: CardEmoji.HEART,
  cosmetic: {
    cardGif: mediaLinks.sense_teaParty_gif,
  },
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} held a tea party!`);
    selfStat(0, StatsEnum.HP);
  },
});

export const a_piercingDrill = new Card({
  title: "Piercing Drill",
  description: ([dmg]) =>
    `DMG ${dmg} + DEF/3. Pierces through 1/3 of the opponent's defense.`,
  effects: [14],
  hpCost: 12,
  emoji: CardEmoji.PUNCH,
  cardMetadata: { nature: Nature.Attack, signature: true },
  cosmetic: {
    cardGif: mediaLinks.sense_piercingDrill_gif,
  },
  cardAction: ({ name, selfStats, sendToGameroom, flatAttack, calcEffect }) => {
    sendToGameroom(`${name} used a piercing drill!`);
    const damage = calcEffect(0) + selfStats.DEF / 3;
    flatAttack(damage, 1 / 3);
  },
});

const senseDeck = [
  { card: a_hairWhip, count: 2 },
  { card: sharpen, count: 1 },
  { card: manaConcealment, count: 2 },
  { card: a_pierce, count: 2 },
  { card: hairBarrier, count: 3 },
  { card: teaTime, count: 2 },
  { card: teaParty, count: 2 },
  { card: a_piercingDrill, count: 2 },
];

export default senseDeck;
