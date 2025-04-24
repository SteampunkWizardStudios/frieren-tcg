import Card, { Nature } from "../card";
import TimedEffect from "../timedEffect";
import { StatsEnum } from "../stats";
import CommonCardAction from "../util/commonCardActions";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

export const a_hairWhip = new Card({
  title: "Hair Whip",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) =>
    `DEF+${def}. Afterwards, HP-4, DMG ${dmg}+DEF/4.`,
  effects: [2, 7],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} whipped ${character.cosmetic.pronouns.possessive} hair!`,
      TCGThread.Gameroom
    );

    const defIncrease = this.calculateEffectValue(this.effects[0]);
    const newDef = character.stats.stats.DEF + defIncrease;
    character.adjustStat(defIncrease, StatsEnum.DEF);
    const damage = this.calculateEffectValue(this.effects[1]) + newDef / 4;

    CommonCardAction.commonAttack(game, characterIndex, { damage, hpCost: 4 });
  },
});

export const harden = new Card({
  title: "Harden",
  cardMetadata: { nature: Nature.Util },
  description: ([def, atk]) => `HP-1. DEF+${def}. ATK+${atk}.`,
  effects: [2, 2],
  emoji: CardEmoji.SHIELD,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} toughened ${character.cosmetic.pronouns.possessive} hair defense!`,
      TCGThread.Gameroom
    );

    if (character.adjustStat(-1, StatsEnum.HP)) {
      character.adjustStat(
        this.calculateEffectValue(this.effects[0]),
        StatsEnum.DEF
      );
      character.adjustStat(
        this.calculateEffectValue(this.effects[1]),
        StatsEnum.ATK
      );
    }
  },
});

export const rest = new Card({
  title: "Rest",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `DEF-2 for 2 turns. Heal ${hp} HP`,
  effects: [10],
  emoji: CardEmoji.HEART,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} rests up.`, TCGThread.Gameroom);

    character.adjustStat(-2, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Rest",
        description: `DEF-2 for 2 turns`,
        turnDuration: 2,
        removableBySorganeil: false,
        endOfTimedEffectAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} had a good rest.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(2, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_pierce = new Card({
  title: "Pierce",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) =>
    `HP-7. DEF+${def}. Afterwards, DMG ${dmg} + (DEF/4). Pierces through 1/4 of the opponent's defense.`,
  effects: [1, 10],
  emoji: CardEmoji.PUNCH,
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} pierced the opponent!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);

    const damage =
      this.calculateEffectValue(this.effects[1]) +
      character.stats.stats.DEF / 4;
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: 7,
      pierceFactor: 0.25,
    });
  },
});

export const hairBarrier = new Card({
  title: "Hair Barrier",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  effects: [20],
  emoji: CardEmoji.HOURGLASS,
  priority: 2,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364942857307295905/GIF_0653594382.gif?ex=680b8198&is=680a3018&hm=368a1918766556e47cc2e4692113d174afa955d6f59f3206d2f0cb6269df4a34&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} surrounded ${character.cosmetic.pronouns.reflexive} in ${character.cosmetic.pronouns.possessive} hair barrier!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Hair Barrier",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex) => {
          character.adjustStat(-1 * def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const teaTime = new Card({
  title: "Tea Time",
  cardMetadata: { nature: Nature.Util },
  description: ([def, hp]) =>
    `DEF+${def}. Heal ${hp} for both characters. Gain 1 Tea Time snack.`,
  effects: [1, 5],
  tags: { TeaTime: 1 },
  emoji: CardEmoji.HEART,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364949044656607232/GIF_0807192060.gif?ex=680b875b&is=680a35db&hm=ced86d0c723bc4d139d0012c97a29d89d6fad79d084e1607036211869d17b57e&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} enjoyed a cup of tea.`,
      TCGThread.Gameroom
    );
    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

export const teaParty = new Card({
  title: "Tea Party",
  cardMetadata: { nature: Nature.Util },
  description: ([def, hp]) =>
    `DEF+${def}. Heal ${hp} for both characters. Gain 2 Tea Time snacks.`,
  effects: [2, 7],
  tags: { TeaTime: 2 },
  emoji: CardEmoji.RANDOM,
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364970640016281755/GIF_1481380242.gif?ex=680b9b78&is=680a49f8&hm=8d28d2db0acba7954fd24059ededd4d30f495624d7bac107ddfdcd970e28c1da&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    messageCache.push(
      `${character.name} held a tea party!`,
      TCGThread.Gameroom
    );
    const defBuff = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(defBuff, StatsEnum.DEF);

    const hpHeal = this.calculateEffectValue(this.effects[1]);
    character.adjustStat(hpHeal, StatsEnum.HP);
    opponent.adjustStat(hpHeal, StatsEnum.HP);
  },
});

export const a_piercingDrill = new Card({
  title: "Piercing Drill",
  description: ([dmg]) =>
    `HP-12. DMG ${dmg} + DEF/3. Pierces through 1/3 of the opponent's defense.`,
  effects: [14],
  emoji: CardEmoji.PUNCH,
  cardMetadata: { nature: Nature.Attack, signature: true },
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364943023678427196/GIF_3233937113.gif?ex=680b81c0&is=680a3040&hm=07d5b41617b811cd069cc08f1de64d9966b4d03df7936844262be5f6ee25e0cb&",
  },
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} used a piercing drill!`,
      TCGThread.Gameroom
    );
    const damage =
      this.calculateEffectValue(this.effects[0]) +
      character.stats.stats.DEF / 3;
    CommonCardAction.commonAttack(game, characterIndex, {
      damage,
      hpCost: 12,
      pierceFactor: 1 / 3,
    });
  },
});

export const senseDeck = [
  { card: a_hairWhip, count: 2 },
  { card: harden, count: 2 },
  { card: rest, count: 1 },
  { card: a_pierce, count: 2 },
  { card: hairBarrier, count: 4 },
  { card: teaTime, count: 2 },
  { card: teaParty, count: 1 },
  { card: a_piercingDrill, count: 2 },
];
