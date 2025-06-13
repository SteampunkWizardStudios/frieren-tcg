import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { manaConcealment } from "./FernDeck";

export const a_hairWhip = new Card({
  title: "Hair Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) => `DEF+${def}. Afterwards, DMG ${dmg}+DEF/4.`,
  effects: [2, 7],
  hpCost: 4,
  emoji: CardEmoji.PUNCH,
  cardAction: function (
    this: Card,
    {
      game,
      name,
      selfStats,
      possessive,
      selfStat,
      flatAttack,
      sendToGameroom,
      calcEffect,
    }
  ) {
    sendToGameroom(`${name} whipped ${possessive} hair!`);

    selfStat(0, StatsEnum.DEF, game);

    const damage = calcEffect(1) + selfStats.DEF / 4;
    flatAttack(damage);
  },
});

export const sharpen = new Card({
  title: "Sharpen",
  cardMetadata: { nature: Nature.Util },
  description: ([def, atk, spd]) => `DEF+${def}. ATK+${atk}. SPD+${spd}`,
  effects: [2, 2, 2],
  hpCost: 3,
  emoji: CardEmoji.PUNCH,
  cardAction: function (
    this: Card,
    { game, name, possessive, sendToGameroom, selfStat }
  ) {
    sendToGameroom(`${name} sharpened ${possessive} hair drills!`);

    selfStat(0, StatsEnum.DEF, game);
    selfStat(1, StatsEnum.ATK, game);
    selfStat(2, StatsEnum.SPD, game);
  },
});

export const a_pierce = new Card({
  title: "Pierce",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) =>
    `DEF+${def}. Afterwards, DMG ${dmg} + (DEF/4). Pierces through 1/4 of the opponent's defense.`,
  effects: [2, 10],
  hpCost: 7,
  emoji: CardEmoji.PUNCH,
  cardAction: function (
    this: Card,
    { game, name, selfStats, sendToGameroom, selfStat, flatAttack, calcEffect }
  ) {
    sendToGameroom(`${name} pierced the opponent!`);

    selfStat(0, StatsEnum.DEF, game);

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
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364942857307295905/GIF_0653594382.gif?ex=680b8198&is=680a3018&hm=368a1918766556e47cc2e4692113d174afa955d6f59f3206d2f0cb6269df4a34&",
  },
  cardAction: function (
    this: Card,
    {
      game,
      self,
      name,
      possessive,
      reflexive,
      selfStat,
      sendToGameroom,
      calcEffect,
    }
  ) {
    sendToGameroom(
      `${name} surrounded ${reflexive} in ${possessive} hair barrier!`
    );

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF, game);

    self.timedEffects.push(
      new TimedEffect({
        name: "Hair Barrier",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-1 * def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

export const teaTime = new Card({
  title: "Tea Time",
  cardMetadata: { nature: Nature.Util, teaTime: 1 },
  description: ([spd, hp]) =>
    `SPD+${spd}. Empower both characters' hands. Heal ${hp} for both characters. Gain 1 Tea Time snack.`,
  effects: [1, 4],
  emoji: CardEmoji.HEART,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364949044656607232/GIF_0807192060.gif?ex=680b875b&is=680a35db&hm=ced86d0c723bc4d139d0012c97a29d89d6fad79d084e1607036211869d17b57e&",
  },
  cardAction: function (
    this: Card,
    { game, self, opponent, name, selfStat, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(
      `${name} and ${opponent.name} enjoyed a refreshing cup of tea. Both characters' hands are empowered!`
    );

    selfStat(0, StatsEnum.SPD, game);

    self.empowerHand();
    opponent.empowerHand();

    const hpHeal = calcEffect(1);
    self.adjustStat(hpHeal, StatsEnum.HP, game);
    opponent.adjustStat(hpHeal, StatsEnum.HP, game);
  },
});

export const teaParty = new Card({
  title: "Tea Party",
  cardMetadata: { nature: Nature.Util, teaTime: 2 },
  description: ([spd, hp]) =>
    `SPD+${spd}. Empower both characters' hands twice. Heal ${hp} for both characters. Gain 2 Tea Time snacks.`,
  effects: [2, 7],
  emoji: CardEmoji.RANDOM,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364992405018902568/GIF_0507169428.gif?ex=680c587d&is=680b06fd&hm=dd2441c0af97bd72ee4c6ee262830ce4a418d07197f696bae7bb832202d6498c&",
  },
  cardAction: function (
    this: Card,
    { game, self, opponent, name, selfStat, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(
      `${name} and ${opponent.name} held a tea party! Both characters' hands are greatly empowered!`
    );

    selfStat(0, StatsEnum.SPD, game);

    for (let i = 0; i < 2; i++) {
      self.empowerHand();
      opponent.empowerHand();
    }

    const hpHeal = calcEffect(1);
    self.adjustStat(hpHeal, StatsEnum.HP, game);
    opponent.adjustStat(hpHeal, StatsEnum.HP, game);
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
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364943023678427196/GIF_3233937113.gif?ex=680b81c0&is=680a3040&hm=07d5b41617b811cd069cc08f1de64d9966b4d03df7936844262be5f6ee25e0cb&",
  },
  cardAction: function (
    this: Card,
    { name, selfStats, sendToGameroom, flatAttack, calcEffect }
  ) {
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
