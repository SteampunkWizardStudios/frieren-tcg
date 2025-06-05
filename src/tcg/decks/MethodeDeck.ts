import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";

const scatterShot = new Card({
  title: "Scatter Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of next turn`,
  effects: [3],
  hpCost: 6,
  cardAction: () => {},
});

const delayedShot = new Card({
  title: "Delayed Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg]) =>
    `${dmg} DMG. Deal DMG ${dmg} x2 at the end of 2 turns from now.`,
  effects: [3],
  hpCost: 6,
  cardAction: () => {},
});

const piercingShot = new Card({
  title: "Piercing Shot",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.METHODE_CARD,
  description: ([dmg, bonus]) =>
    `DMG ${dmg}. If this character did not use an attacking move last turn, deal an additional ${bonus} DMG with 50% pierce.`,
  effects: [9, 4],
  hpCost: 8,
  cardAction: () => {},
});

const polymath = new Card({
  title: "Polymath",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([buff]) =>
    `ATK+${buff}, DEF+${buff}, SPD+${buff}. Discard all cards in your hand and draw a new hand. Roll 1 additional dice the following turn.`,
  effects: [],
  cardAction: () => {},
});

const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) => `TrueDEF+${def} for 1 turn.`,
  effects: [20],
  priority: 2,
  cardAction: () => {},
});

const manaDetection = new Card({
  title: "Mana Detection",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent uses an attacking move this turn, next turn, all your moves have Priority+1.`,
  effects: [20],
  priority: 2,
  cardAction: () => {},
});

const reversePolarity = new Card({
  title: "Reverse Polarity",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.METHODE_CARD,
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. If the opponent uses an attacking move this turn, at this turn's end, attack with base DMG equal to the move's DMG.`,
  effects: [20],
  priority: 2,
  cardAction: () => {},
});

const goddessHealingMagic = new Card({
  title: "Goddess' Healing Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([hp, bonusHp, def]) =>
    `Heal ${hp} HP. Heal an additional ${bonusHp} HP and gain ${def} DEF if the opponent did not use an attacking move this turn.`,
  effects: [7, 3, 2],
  cardAction: () => {},
});

const restraintMagic = new Card({
  title: "Restraint Magic",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([debuff]) =>
    `Set your DEF to 1 until this turn's end. Opp's ATK-${debuff}, DEF-${debuff}, SPD-${debuff} for the next 4 turns.`,
  effects: [4],
  priority: 1,
  cardAction: () => {},
});

const hypnoticCompulsion = new Card({
  title: "Hypnotic Compulsion",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([atkDebuff]) =>
    `Opp's ATK-${atkDebuff}. The opponent repeats the move they used last turn on the following turn.`,
  effects: [],
  cardAction: () => {},
});

const spotWeakness = new Card({
  title: "Spot Weakness",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.METHODE_CARD,
  description: ([spd, atk, bonusAtk]) =>
    `SPD+${spd} ATK+${atk}. If the opponent uses an attacking move this turn, ATK+${bonusAtk}.`,
  effects: [2, 1, 3],
  cardAction: () => {},
});

const methodeDeck = [
  { card: scatterShot, count: 2 },
  { card: delayedShot, count: 2 },
  { card: piercingShot, count: 2 },
  { card: polymath, count: 2 },
  { card: ordinaryDefensiveMagic, count: 1 },
  { card: manaDetection, count: 1 },
  { card: reversePolarity, count: 1 },
  { card: goddessHealingMagic, count: 2 },
  { card: restraintMagic, count: 1 },
  { card: hypnoticCompulsion, count: 1 },
  { card: spotWeakness, count: 1 },
];

export default methodeDeck;
