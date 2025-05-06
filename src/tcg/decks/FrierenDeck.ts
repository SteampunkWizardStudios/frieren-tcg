import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

export const a_zoltraak = new Card({
  title: "Offensive Magic Analysis: Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `HP-5. DMG ${dmg}. 1 Analysis stacks will be gained after attack.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256267501888/Offensive_Magic_Analysis_Zoltraak.png?ex=67e97971&is=67e827f1&hm=193fb4668269bd8509f7b4ce4a092c12af7b44ac8fd5264dfac08c5da5a349bf&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364283548789379163/GIF_2604048789.gif?ex=68091b91&is=6807ca11&hm=a7fd85473cc4a8c441193bd990c6517e95d5cc6789023f530c27f4d21e5e70dc&",
  },
  tags: { PostAnalysis: 1 },
  effects: [8],
  cardAction: function (this: Card, { sendToGameroom, name, basicAttack }) {
    sendToGameroom(`${name} fired Zoltraak!`);
    basicAttack(0, 5);
  },
});

export const fieldOfFlower = new Card({
  title: "Spell to make a Field of Flowers",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turn ends, heal ${endHp}.`,
  cosmetic: {
    cardGif: "https://c.tenor.com/Sd_BDB5kVZ8AAAAd/tenor.gif",
    cardImageUrl:
      // "https://cdn.discordapp.com/attachments/1351391350398128159/1352873016660590653/Spell_to_make_a_field_of_flowers_4.png?ex=67df98ae&is=67de472e&hm=e5080e39c9818eee5f9a3d559a829b6f3ecab15be85b9897fb6c28ea27c6e674&",
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255269130370/Spell_to_make_a_field_of_flowers_New.png?ex=67e97971&is=67e827f1&hm=b03c906280c5f4f09d212bae40f29b671377145e137dbfe5f4d5da93be130dd7&",
  },
  emoji: CardEmoji.FLOWER_FIELD,
  effects: [5, 3],
  cardAction: function (
    this: Card,
    { self, name, selfStat, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} conjured a field of flowers!`);

    selfStat(0, StatsEnum.HP);
    const endOfTurnHealing = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          messageCache.push(
            `The Field of Flowers soothes ${name}.`,
            TCGThread.Gameroom
          );
          game.characters[characterIndex].adjustStat(
            endOfTurnHealing,
            StatsEnum.HP
          );
        },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push("The Field of Flowers fades.", TCGThread.Gameroom);
        },
      })
    );
  },
});

export const a_judradjim = new Card({
  title: "Destructive Lightning: Judradjim",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `HP-7. DMG ${dmg}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588256728748365/Destructive_Lightning_Analysis_Judradjim.png?ex=67e97972&is=67e827f2&hm=15cd0d0ef4df4a3d1559b405c3e8843ecbda4b64b349e2149fb9d22db3c5e817&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364225378952020029/GIF_1668382682.gif?ex=6808e564&is=680793e4&hm=2c769b1580a0639d7e83a046cad25ff641b839f91ab7c035b0ae844aae3b551c&",
  },
  effects: [13],
  cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
    sendToGameroom(`${name} sent forth Judradjim!`);
    basicAttack(0, 7);
  },
});

export const a_vollzanbel = new Card({
  title: "Hellfire Summoning: Vollzanbel",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `HP-10. DMG ${dmg}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255923572736/Hellfire_Summoning_Vollzanbel.png?ex=67e97971&is=67e827f1&hm=c31d35c7ce7820b3d386f7f3119f463538d83576ad2a4f0ed2a83370390ce87c&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364225342218309674/GIF_1142333080.gif?ex=6808e55b&is=680793db&hm=11bd4be532ecf85eab598b0533e6c5b747d9bb8483c74ec2a86f3ede0fb352aa&",
  },
  effects: [18],
  cardAction: function (this: Card, { name, sendToGameroom, basicAttack }) {
    sendToGameroom(`${name} summoned Vollzanbel!`);
    basicAttack(0, 10);
  },
});

export const barrierMagicAnalysis = new Card({
  title: "Barrier Magic Analysis",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, spd, def]) =>
    `ATK+${atk}. SPD+${spd}. Opponent's DEF-${def}`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254463951029/Barrier_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=d65bb623550e93604fbedbc80cb6638c52b8ead8f1a70114e410a52df1260605&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364275399940378707/GIF_1207512349.gif?ex=680913fa&is=6807c27a&hm=5a7ddf666a159597f0d6978040ba415d4e8e02fca6413ee098f673be9207d099&",
  },
  effects: [2, 1, 1],
  tags: { Analysis: 2 },
  cardAction: function (
    this: Card,
    { name, sendToGameroom, selfStat, opponentStat }
  ) {
    sendToGameroom(`${name} analyzed the opponent's defense!`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.SPD);
    opponentStat(2, StatsEnum.DEF, -1);
  },
});

export const demonMagicAnalysis = new Card({
  title: "Demon Magic Analysis",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, spd, def]) => `ATK+${atk}. SPD+${spd}. DEF+${def}.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254107439245/Demon_Magic_Analysis.png?ex=67e97971&is=67e827f1&hm=8318bc5d0892f966e0bc07d29fd6042ab37cc93cdc86a3d58feb438631b3b354&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364282397381890069/GIF_0344215957.gif?ex=68091a7e&is=6807c8fe&hm=6c01215ed6985660a179640f2ed6e22c82e73adc4c581861829f5d4a9b9bc8e8&",
  },
  effects: [2, 2, 1],
  tags: { Analysis: 2 },
  cardAction: function (this: Card, { name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} analyzed ancient demon's magic!`);
    selfStat(0, StatsEnum.ATK);
    selfStat(1, StatsEnum.SPD);
    selfStat(2, StatsEnum.DEF);
  },
});

export const ordinaryDefensiveMagic = new Card({
  title: "Ordinary Defensive Magic",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588255554470018/Ordinary_Defensive_Magic.png?ex=67e97971&is=67e827f1&hm=6e44ae1f09dc7b05f29ddb6a646f9852692ff2427e333e1c0c4562c296918ce9&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364275430797873243/GIF_0437404717.gif?ex=68091401&is=6807c281&hm=1f7c1e031326058f4b6d1d45cb7fc27361d2d63f142449411a1f8ff4b5f14f85&",
  },
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { name, self, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} cast ordinary defensive magic!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.DEF);

    self.timedEffects.push(
      new TimedEffect({
        name: "Ordinary Defensive Magic",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

export const a_theHeightOfMagicBase = new Card({
  title: `"The Height of Magic"`,
  description: ([dmg]) =>
    `When used with HP <= 25, Priority+1. Strike for DMG ${dmg}. Afterward, decreases DEF and SPD by 20, and set HP to 1. Treat this card as "Spell to make a Field of Flowers" when used with HP > 25.`,
  emoji: CardEmoji.FRIEREN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1355588254866473161/The_Height_of_Magic.png?ex=67e97971&is=67e827f1&hm=0bddcf6c49f763947308ba3e63c58a8727730a9af0ff9c0175e948af704e29b3&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364284928543424652/GIF_0512568585.gif?ex=68091cda&is=6807cb5a&hm=fa96e7031f374a6a962522623b61e81a53133ba49d57583e77d483e379a31edf&",
  },
  cardMetadata: { nature: Nature.Attack, signature: true },
  priority: 1,
  effects: [30],
  cardAction: function (
    this: Card,
    { self, name, selfStats, sendToGameroom, basicAttack }
  ) {
    sendToGameroom(`${name} used "The Height of Magic"`);

    if (selfStats.HP > 25) {
      sendToGameroom(`${name}'s HP is greater than 25. The move failed!`);
      return;
    }

    sendToGameroom("The Height of Magic is on display.");
    basicAttack(0, 0);

    self.adjustStat(-20, StatsEnum.DEF);
    self.adjustStat(-20, StatsEnum.SPD);
    self.setStat(1, StatsEnum.HP);
  },
});

export const a_theHeightOfMagic = new Card({
  ...a_theHeightOfMagicBase,
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.HP > 25) {
      return new Card({
        ...fieldOfFlower,
        empowerLevel: this.empowerLevel,
        priority: 0,
      });
    } else {
      return new Card({
        ...a_theHeightOfMagicBase,
        empowerLevel: this.empowerLevel,
        priority: 1,
      });
    }
  },
});

const frierenDeck = [
  { card: a_zoltraak, count: 2 },
  { card: a_judradjim, count: 2 },
  { card: a_vollzanbel, count: 2 },
  { card: barrierMagicAnalysis, count: 3 },
  { card: demonMagicAnalysis, count: 2 },
  { card: ordinaryDefensiveMagic, count: 2 },
  { card: fieldOfFlower, count: 2 },
  { card: a_theHeightOfMagic, count: 1 },
];

export default frierenDeck;