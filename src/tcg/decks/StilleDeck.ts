import Card, { Nature } from "../card";
import CommonCardAction from "../util/commonCardActions";
import { StatsEnum } from "../stats";
import TimedEffect from "../timedEffect";
import Rolls from "../util/rolls";
import { CardEmoji } from "../formatting/emojis";
import { TCGThread } from "../../tcgChatInteractions/sendGameMessage";

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
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} sharpened ${character.cosmetic.pronouns.possessive} feathers!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-3, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[1]),
      hpCost: 0,
    });
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
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} hid ${character.cosmetic.pronouns.reflexive} and flew to safety!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-3, StatsEnum.SPD);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.DEF
    );
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
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} landed on the ground.`,
      TCGThread.Gameroom
    );

    character.adjustStat(-5, StatsEnum.SPD);
    character.adjustStat(-3, StatsEnum.DEF);
    character.adjustStat(
      this.calculateEffectValue(this.effects[0]),
      StatsEnum.HP
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `DEF-3 for 2 turns.`,
        turnDuration: 2,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} opened its wings.`,
            TCGThread.Gameroom
          );
          character.adjustStat(3, StatsEnum.DEF);
        },
      })
    );

    character.timedEffects.push(
      new TimedEffect({
        name: "Roost",
        description: `SPD-5 for 3 turns.`,
        turnDuration: 3,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, messageCache) => {
          messageCache.push(
            `${character.name} took flight again!`,
            TCGThread.Gameroom
          );
          character.adjustStat(5, StatsEnum.SPD);
        },
      })
    );
  },
});

export const deflect = new Card({
  title: "Deflect",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `Priority+2. Increases DEF by ${def} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  effects: [20],
  priority: 2,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} prepares to deflect an attack!`,
      TCGThread.Gameroom
    );

    const def = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(def, StatsEnum.DEF);
    character.timedEffects.push(
      new TimedEffect({
        name: "Deflect",
        description: `Increases DEF by ${def} until the end of the turn.`,
        turnDuration: 1,
        priority: -1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-def, StatsEnum.DEF);
        },
      })
    );
  },
});

const flyAway = new Card({
  title: "Fly Away",
  cardMetadata: { nature: Nature.Util },
  description: ([spd]) => `Priority+2. SPD + ${spd} until the end of the turn.`,
  emoji: CardEmoji.STILLE_CARD,
  priority: 2,
  effects: [25],
  cosmetic: {
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1361940199583780864/IMG_3171.gif?ex=6807d567&is=680683e7&hm=55cb8759a21dc4e1d852861c8856dd068b299cb289a109cd4be8cdd27cca4e2f&",
  },
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(`${character.name} flew away!`, TCGThread.Gameroom);

    const spd = this.calculateEffectValue(this.effects[0]);
    character.adjustStat(spd, StatsEnum.SPD);
    character.timedEffects.push(
      new TimedEffect({
        name: "Fly Away",
        description: `Increases SPD by ${spd} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          character.adjustStat(-spd, StatsEnum.SPD);
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
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.characters[characterIndex];
    messageCache.push(
      `${character.name} called its fellow friends the Geisel for help!`,
      TCGThread.Gameroom
    );

    character.adjustStat(-20, StatsEnum.SPD);
    const damage = this.calculateEffectValue(this.effects[0]);
    character.timedEffects.push(
      new TimedEffect({
        name: "Geisel Strike!",
        description: `Deal ${damage} at each turn's end.`,
        turnDuration: 2,
        endOfTurnAction: (game, characterIndex) => {
          messageCache.push("The Geisel doesn't stop!", TCGThread.Gameroom);
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

export const stilleDeck = [
  { card: a_peck, count: 2 },
  { card: a_ironFeather, count: 3 },
  { card: hide, count: 2 },
  { card: roost, count: 2 },
  { card: deflect, count: 2 },
  { card: flyAway, count: 3 },
  { card: a_geisel, count: 2 },
];
