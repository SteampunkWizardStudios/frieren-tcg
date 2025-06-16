import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

export const a_trustInYourAllyFrierensZoltraak = new Card({
  title: "Trust in Your Ally: Frieren's Zoltraak",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg} + HP/9`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035311357362268/Trust_in_your_Ally_Frierens_Zoltraak_1.png?ex=67e02fd4&is=67dede54&hm=6cb8d375f497cf7bca2637de8d70a900901116aa53f0b0aa3e977ddc27a5def8&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361022845664104740/GIF_0907854706.gif?ex=6807cacc&is=6806794c&hm=c4c3d7908005bbcd23defb42f4c9b756135c8a5c1726330d0a52495998ec2c53&",
  },
  effects: [5],
  hpCost: 5,
  cardAction: ({
    name,
    characterName,
    sendToGameroom,
    calcEffect,
    flatAttack,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Frieren!`
        : `${name} used Zoltraak.`
    );

    const damage = Number(
      (calcEffect(0) + character.stats.stats.HP / 9).toFixed(2)
    );
    flatAttack(damage, game);
  },
});

export const a_trustInYourAllyFernsBarrage = new Card({
  title: "Trust in Your Ally: Fern's Barrage",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `DMG ${dmg}+HP/10 DMG. Next turn, deal ${dmg}+HP/10 DMG at turn end.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310996394024/Trust_in_your_Ally_Ferns_Barrage.png?ex=67e02fd4&is=67dede54&hm=57cae7a03eefb0dacaa8649910e48ab411d50ca94a9855b078098e751b92ae75&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361022927788834966/GIF_2294206836.gif?ex=6807cae0&is=68067960&hm=ca32887d358b3c43ad2d4c5618373b8cab1a11d0acdcc496a7203544936a9244&",
  },
  effects: [3],
  hpCost: 7,
  cardAction: ({
    sendToGameroom,
    name,
    characterName,
    calcEffect,
    flatAttack,
    selfEffect,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Fern!`
        : `${name} used a simple offensive spell barrage.`
    );
    const damage = Number(
      (calcEffect(0) + character.stats.stats.HP / 10).toFixed(2)
    );

    flatAttack(damage, game);

    selfEffect({
      name: "Barrage",
      description: `Deal ${damage} at the end of the effect.`,
      turnDuration: 2,
      activateEndOfTurnActionThisTurn: false,
      endOfTurnAction: (game, charIdx, _msgCache) => {
        sendToGameroom(`The barrage continues!`);
        CommonCardAction.commonAttack(game, charIdx, {
          damage,
          isTimedEffectAttack: true,
        });
      },
    });
  },
});

const a_trustInYourAllyStarksLightningStrike = new Card({
  title: "Trust in Your Ally: Stark's Lightning Strike",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) => `DMG ${dmg}+HP/8.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035310677622845/Trust_in_your_Ally_Starks_Lightning_Strike.png?ex=67e02fd4&is=67dede54&hm=608a0bc2795f44b1512ecb7d26b29213aedada2f9f9db64b178447be0dd98476&",
  },
  effects: [10],
  hpCost: 9,
  cardAction: (
    { name, characterName, sendToGameroom, calcEffect, flatAttack }
  ) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on help from Stark!`
        : `${name} used lightning strike.`
    );

    const damage = Number(
      (calcEffect(0) + character.stats.stats.HP / 8).toFixed(2)
    );
    flatAttack(damage, game);
  },
});

export const mugOfBeer = new Card({
  title: "Mug of Beer",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, atk]) =>
    `HP+${hp}. ATK+${atk}. DEF-2 and SPD-2 for 2 turns.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353038477805228073/Mug_of_Beer_2.png?ex=67e032c7&is=67dee147&hm=9e453e019c32d60027135834549e42bd19f16995569570a3012b9626a5fdf6f4&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361017071886012681/GIF_3575013087.gif?ex=6807c56c&is=680673ec&hm=1e20739be8a75140974b9babb65729cf83c31d4f3d991bc35c90207fda41cd34&",
  },
  effects: [7, 2],
  cardAction: ({
    name,
    sendToGameroom,
    selfStat,
    flatSelfStat,
    selfEffect,
  }) => {
    sendToGameroom(`${name} downed a mug of beer.`);
    selfStat(0, StatsEnum.HP, game);
    selfStat(1, StatsEnum.ATK, game);
    flatSelfStat(-2, StatsEnum.DEF, game);
    flatSelfStat(-2, StatsEnum.SPD, game);

    selfEffect({
      name: "Drunk",
      description: `DEF-2. SPD-2.`,
      turnDuration: 2,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: (_game, _charIdx, _msgCache) => {
        sendToGameroom(`${name}'s drowsiness faded.`);
        flatSelfStat(2, StatsEnum.DEF, game);
        flatSelfStat(2, StatsEnum.SPD, game);
      },
    });
  },
});

export const smokeBreak = new Card({
  title: "Smoke Break",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309906133052/Smoke_Break.png?ex=67e02fd4&is=67dede54&hm=a6eaadebd1ce83f74e2819c16eb7cb57e8fb0f9888f8083248ac49b54119ccf4&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361017954392866997/3.2.1.sein.gif?ex=6807c63e&is=680674be&hm=110488d337d86b35ac2b84cfec08e01c070a3ecb4563ccdfb3c1df602c5249f9&",
  },
  effects: [3, 2, 2],
  hpCost: 3,
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} took a smoke break.`);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(1, StatsEnum.DEF, game);
    selfStat(2, StatsEnum.SPD, game);
  },
});

export const awakening = new Card({
  title: "Awakening",
  cardMetadata: { nature: Nature.Util },
  description: ([atk, def, spd]) => `ATK+${atk}. DEF+${def}. SPD+${spd}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035309436375121/Awakening.png?ex=67e02fd3&is=67dede53&hm=48c7275f912f8927990fa0073b3f8a6c2e7279042e5bd8edfe1a925261a0e5b5&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361016482263208137/GIF_1188387197.gif?ex=6807c4df&is=6806735f&hm=f5ed7c521144db3412cf1a52b1417497950c1adf96d45301ff7421b5a75d8ca7&",
  },
  effects: [2, 1, 2],
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} used Awakening!`);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(1, StatsEnum.DEF, game);
    selfStat(2, StatsEnum.SPD, game);
  },
});

export const poisonCure = new Card({
  title: "Poison Cure",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `HP+${hp}.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://media.discordapp.net/attachments/1351391350398128159/1353035308844974100/Poison_Cure.png?ex=67e02fd3&is=67dede53&hm=76216578c19115f3ddcd9bff1c497b0c7c2f9ee87152f02c4085d681dd0dc6ae&=&format=webp&quality=lossless&width=908&height=1160",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361016416488390776/GIF_0966802288.gif?ex=6807c4d0&is=68067350&hm=2d09267ccc0505a949b0c57e6c9bb84fc99decb89d35637cadced435723f5904&",
  },
  effects: [10],
  cardAction: ({ name, sendToGameroom, selfStat }) => {
    sendToGameroom(`${name} applied a poison cure.`);
    selfStat(0, StatsEnum.HP, game);
  },
});

export const braceYourself = new Card({
  title: "Brace Yourself",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Increases TrueDEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035308182147102/Brace_Yourself.png?ex=67e02fd3&is=67dede53&hm=b4bcacc46cae5fcd120b76d666ef606186621d3edc230a851e09a77976fce8eb&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364568772136140810/GIF_1787578930.gif?ex=680a2533&is=6808d3b3&hm=1cfb307428d03155177b0ce8439cc92792a63fc2588d8483cf618682105449a3&",
  },
  priority: 2,
  effects: [20],
  cardAction: ({
    name,
    sendToGameroom,
    characterName,
    calcEffect,
    possessive,
    reflexive,
  }) => {
    sendToGameroom(
      characterName === CharacterName.Sein
        ? `${name} called on ${possessive} allies to brace themselves!`
        : `${name} braced ${reflexive}.`
    );

    const def = calcEffect(0);
    selfStat(0, StatsEnum.TrueDEF, game);

    selfEffect({
      name: "Brace Yourself",
      description: `Increases TrueDEF by ${def} until the end of the turn.`,
      priority: -1,
      turnDuration: 1,
      metadata: { removableBySorganeil: false },
      endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
        selfStat(0, StatsEnum.TrueDEF, game, -1);
      },
    });
  },
});

export const a_threeSpearsOfTheGoddess = new Card({
  title: "Three Spears of the Goddess",
  description: ([dmg]) => `At the next 3 turn ends, deal ${dmg}+HP/10 DMG.`,
  emoji: CardEmoji.SEIN_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1353035307397681172/Three_Spears_of_the_Godess.png?ex=67e02fd3&is=67dede53&hm=671b75347795840779fe6e5007f8a0918b04e3b6a558b561ca9ce4b4c18694a8&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1360972240732291242/GIF_0993654948.gif?ex=6808446b&is=6806f2eb&hm=90213c37d073b6d0b0354a3893d14b16c727fa9b04c457693110512a142c0338&",
  },
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [7],
  hpCost: 15,
  cardAction: ({ name, sendToGameroom, calcEffect, selfEffect }) => {
    sendToGameroom(`${name} used Three Spears of the Goddess!`);

    const damage = Number(
      (calcEffect(0) + character.stats.stats.HP / 10).toFixed(2)
    );

    selfEffect({
      name: "Three Spears of the Goddess",
      description: `Deal ${damage} at each turn's end.`,
      turnDuration: 3,
      endOfTurnAction: (game, characterIndex) => {
        messageCache.push(
          "The goddess' spears continue to rain!",
          TCGThread.Gameroom
        );
        CommonCardAction.commonAttack(game, characterIndex, {
          damage,
          isTimedEffectAttack: true,
        });
      },
    });
  },
});

const seinDeck = [
  { card: a_trustInYourAllyFrierensZoltraak, count: 2 },
  { card: a_trustInYourAllyStarksLightningStrike, count: 2 },
  { card: a_trustInYourAllyFernsBarrage, count: 2 },
  { card: mugOfBeer, count: 2 },
  { card: smokeBreak, count: 1 },
  { card: awakening, count: 2 },
  { card: poisonCure, count: 2 },
  { card: braceYourself, count: 2 },
  { card: a_threeSpearsOfTheGoddess, count: 1 },
];

export default seinDeck;
