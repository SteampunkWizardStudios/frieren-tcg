import Card, { Nature } from "@tcg/card";
import CommonCardAction from "@tcg/util/commonCardActions";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import Rolls from "@tcg/util/rolls";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const a_peck = new Card({
  title: "Peck",
  cardMetadata: { nature: Nature.Attack },
  description: ([dmg]) =>
    `SPD-2. Discard a random card in hand and draw 1 card. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    { name, self, sendToGameroom, basicAttack }
  ) {
    sendToGameroom(`${name} pecked the opposition!`);

    self.adjustStat(-2, StatsEnum.SPD);
    self.discardCard(Rolls.rollDAny(5));
    self.drawCard();
    basicAttack(0, 0);
  },
});

const a_ironFeather = new Card({
  title: "Iron Feather",
  cardMetadata: { nature: Nature.Attack },
  description: ([def, dmg]) => `SPD-3. DEF+${def}. DMG ${dmg}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [1, 3],
  cardAction: function (
    this: Card,
    { reflexive, name, sendToGameroom, basicAttack, flatSelfStat, selfStat }
  ) {
    sendToGameroom(`${name} sharpened ${reflexive} feathers!`);

    flatSelfStat(-3, StatsEnum.SPD);
    selfStat(0, StatsEnum.DEF);

    basicAttack(1, 0);
  },
});

const hide = new Card({
  title: "Hide",
  cardMetadata: { nature: Nature.Util },
  description: ([def]) => `SPD-3. DEF+${def}.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [2],
  cardAction: function (
    this: Card,
    { name, reflexive, selfStat, flatSelfStat, sendToGameroom }
  ) {
    sendToGameroom(`${name} hid ${reflexive} and flew to safety!`);

    flatSelfStat(-3, StatsEnum.SPD);
    selfStat(0, StatsEnum.DEF);
  },
});

const roost = new Card({
  title: "Roost",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) => `SPD-5 for 3 turns. DEF-3 for 2 turns. Heal ${hp}HP.`,
  emoji: CardEmoji.ROOST_CARD,
  effects: [5],
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStat, flatSelfStat }
  ) {
    sendToGameroom(`${name} landed on the ground.`);

    flatSelfStat(-5, StatsEnum.SPD);
    flatSelfStat(-3, StatsEnum.DEF);
    selfStat(0, StatsEnum.HP);

    self.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `DEF-3 for 2 turns.`,
        turnDuration: 2,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(`${name} opened its wings.`, TCGThread.Gameroom);
          self.adjustStat(3, StatsEnum.DEF);
        },
      })
    );

    self.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `SPD-5 for 3 turns.`,
        turnDuration: 3,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(`${name} took flight again!`, TCGThread.Gameroom);
          self.adjustStat(5, StatsEnum.SPD);
        },
      })
    );
  },
});

export const deflect = new Card({
  title: "Deflect",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) => `Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} prepares to deflect an attack!`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.DEF);

    self.timedEffects.push(
      new TimedEffect({
        name: "Deflect",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const flyAway = new Card({
  title: "Fly Away",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) => `SPD + ${spd} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  priority: 2,
  effects: [25],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361940199583780864/IMG_3171.gif?ex=6807d567&is=680683e7&hm=55cb8759a21dc4e1d852861c8856dd068b299cb289a109cd4be8cdd27cca4e2f&",
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} flew away!`);

    const spd = calcEffect(0);
    self.adjustStat(spd, StatsEnum.SPD);

    self.timedEffects.push(
      new TimedEffect({
        name: "Fly Away",
        description: `Increases SPD by ${spd} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          self.adjustStat(-spd, StatsEnum.SPD);
        },
      })
    );
  },
});

export const a_geisel = new Card({
  title: "Geisel",
  description: ([dmg]) =>
    `SPD-20. Lands on a tree and asks its fellow Geisel for help! Geisel (ATK: 15) will show up to attack for ${dmg}DMG for 2 turns.`,
  emoji: CardEmoji.STILLE_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true },
  effects: [15],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1364971079096995840/GIF_0867566819.gif?ex=680b9be1&is=680a4a61&hm=af689691d54884d9f7df5a639c214146c59d7b3a9a6b0e8547fb41cf6b914c6c&",
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} called its fellow friends the Geisel for help!`);

    self.adjustStat(-20, StatsEnum.SPD);
    const damage = calcEffect(0);

    self.timedEffects.push(
      new TimedEffect({
        name: "Geisel Strike!",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 2,
        endOfTurnAction: (game, characterIndex) => {
          sendToGameroom("The Geisel doesn't stop!");
          CommonCardAction.commonAttack(game, characterIndex, {
            damage: damage + 15,
            hpCost: 0,
            isTimedEffectAttack: true,
          });
        },
      })
    );
  },
});

const stilleDeck = [
  { card: a_peck, count: 2 },
  { card: a_ironFeather, count: 3 },
  { card: hide, count: 2 },
  { card: roost, count: 2 },
  { card: deflect, count: 2 },
  { card: flyAway, count: 3 },
  { card: a_geisel, count: 2 },
];

export default stilleDeck;
