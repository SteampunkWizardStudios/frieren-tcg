import Card, { Nature } from "@tcg/card";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";
import { CardEmoji } from "@tcg/formatting/emojis";
import { AuraPlatoon } from "../characters/characterData/characterUtil/auraPlatoon";
import Rolls from "../util/rolls";

const rusted_blades = new Card({
  title: "Rusted Blades",
  cardMetadata: { nature: Nature.Util, armyStrength: 5 },
  description: ([atk]) =>
    `ATK+${atk}. Army Strength+5. Summon 1 Swordsmen platoon.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [2],
  hpCost: 2,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth a swordsmen platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Swordsmen);
    self.additionalMetadata.auraPlatoonCount.Swordsmen += 1;
    selfStat(0, StatsEnum.ATK);
  },
});

const weathered_shields = new Card({
  title: "Weathered Shields",
  cardMetadata: { nature: Nature.Util, armyStrength: 5 },
  description: ([def]) =>
    `DEF+${def}. Army Strength+5. Summon 1 Shieldbearers platoon.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [2],
  hpCost: 2,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth a shieldbearers platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Shieldbearers);
    self.additionalMetadata.auraPlatoonCount.Shieldbearers += 1;
    selfStat(0, StatsEnum.DEF);
  },
});

const broken_arrows = new Card({
  title: "Broken Arrows",
  cardMetadata: { nature: Nature.Util, armyStrength: 5 },
  description: ([spd]) =>
    `SPD+${spd}. Army Strength+5. Summon 1 Archers platoon.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [2],
  hpCost: 2,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`${name} called forth an archers platoon.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Archers);
    self.additionalMetadata.auraPlatoonCount.Archers += 1;
    selfStat(0, StatsEnum.SPD);
  },
});

const fallen_empire = new Card({
  title: "Fallen Empire",
  cardMetadata: { nature: Nature.Util, armyStrength: 15 },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Army Strength+15. Summons 1 Swordsmen, 1 Shieldbearer and 1 Archer platoon.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [2],
  hpCost: 10,
  cardAction: function (this: Card, { self, name, sendToGameroom, selfStat }) {
    sendToGameroom(`Before ${name} stands an army rivaling that of an empire.`);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Swordsmen);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Shieldbearers);
    self.additionalMetadata.auraPlatoonQueue.push(AuraPlatoon.Archers);

    self.additionalMetadata.auraPlatoonCount.Swordsmen += 1;
    self.additionalMetadata.auraPlatoonCount.Shieldbearers += 1;
    self.additionalMetadata.auraPlatoonCount.Archers += 1;

    selfStat(0, StatsEnum.ATK);
    selfStat(0, StatsEnum.DEF);
    selfStat(0, StatsEnum.SPD);
  },
});

const retreat = new Card({
  title: "Retreat",
  cardMetadata: { nature: Nature.Defense, hideEmpower: true },
  description: () =>
    `Until the end of the turn, halve ATK. All damage taken that turn will be taken by the Army instead. This move fails if you have no army.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [],
  priority: 2,
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStats, flatSelfStat, possessive }
  ) {
    sendToGameroom(
      `${name} commanded the army to protect ${possessive} retreat.`
    );
    if (self.additionalMetadata.auraPlatoonQueue.length === 0) {
      sendToGameroom(`But there is no army to protect ${possessive}.`);
      return;
    }

    self.additionalMetadata.auraArmyDamageAbsorbtion = 1.0;
    const currentAtk = selfStats.ATK;
    const atkReduction = Number((currentAtk / 2).toFixed(2));
    flatSelfStat(atkReduction, StatsEnum.ATK, -1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Retreat",
        description: `Halve ATK. All damage taken this turn will be taken by the Army instead.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`${name} returned from hiding.`);
          self.additionalMetadata.auraArmyDamageAbsorbtion = 0.5;
          flatSelfStat(atkReduction, StatsEnum.ATK);
        },
      })
    );
  },
});

const rot_over_open_wound = new Card({
  title: "Rot over Open Wound",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.AURA_CARD,
  description: ([stat, dmg]) =>
    `For the next 3 turns, ATK+${stat} and SPD+${stat}. Each hit by Swordsmen and Archers platoon deal an additional ${dmg} flat damage. At each turn end, HP-3.`,
  effects: [2, 1],
  cardAction: ({
    name,
    self,
    sendToGameroom,
    calcEffect,
    possessive,
    flatSelfStat,
  }) => {
    sendToGameroom(`${name}'s army strikes with poisoned blades.`);
    const stat = calcEffect(0);
    const damage = calcEffect(1);

    flatSelfStat(stat, StatsEnum.ATK);
    flatSelfStat(stat, StatsEnum.SPD);
    self.additionalMetadata.auraRotDamage = damage;

    self.timedEffects.push(
      new TimedEffect({
        name: "Rot over Open Wound",
        description: `ATK+${stat}. SPD+${stat}. Each Swordsmen and Archer attacks deal ${damage} flat damage.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          sendToGameroom(`${name} expenses ${possessive} mana...`);
          flatSelfStat(3, StatsEnum.HP, -1);
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom("The wounds scab over.");
          flatSelfStat(stat, StatsEnum.ATK, -1);
          flatSelfStat(stat, StatsEnum.SPD, -1);
          self.additionalMetadata.auraRotDamage = 0;
        },
      })
    );
  },
});

const loyalty = new Card({
  title: "Loyalty",
  cardMetadata: { nature: Nature.Util },
  emoji: CardEmoji.AURA_CARD,
  description: ([def, dmg]) =>
    `For the next 3 turns, DEF+${def}. Once per turn, if hit, counter attack for ${dmg} + 1x #Shieldbearers. At each turn end, HP-3.`,
  effects: [3, 5],
  cardAction: ({
    name,
    self,
    sendToGameroom,
    calcEffect,
    possessive,
    flatSelfStat,
    flatAttack,
  }) => {
    sendToGameroom(`${name}'s army stands in formation.`);
    const def = calcEffect(0);
    const counterDamage = calcEffect(1);

    flatSelfStat(def, StatsEnum.DEF);

    self.ability.abilityCounterEffect = (
      _game,
      _characterIndex,
      _messageCache,
      _attackDamage
    ) => {
      sendToGameroom(`${name}'s army countered the attack.`);
      const shieldbearersCount =
        self.additionalMetadata.auraPlatoonCount.Shieldbearers;
      flatAttack(counterDamage + shieldbearersCount);
    };

    self.timedEffects.push(
      new TimedEffect({
        name: "Loyalty",
        description: `DEF+${def}. Once per turn, if hit, counter attack for ${counterDamage} + 1x #Shieldbearers.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex) => {
          sendToGameroom(`${name} expenses ${possessive} mana...`);
          flatSelfStat(3, StatsEnum.HP, -1);
        },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          sendToGameroom("The army falls apart.");
          flatSelfStat(def, StatsEnum.DEF, -1);
          self.ability.abilityCounterEffect = undefined;
        },
      })
    );
  },
});

const decapitate = new Card({
  title: "Decapitate",
  cardMetadata: { nature: Nature.Attack, armyStrength: -15 },
  description: ([dmg]) =>
    `Army Strength -15. DMG ${dmg} + 2x #Swordsmen. Remove all Swordsmen afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [14],
  hpCost: 8,
  cardAction: function (
    this: Card,
    { self, calcEffect, name, possessive, sendToGameroom, flatAttack }
  ) {
    const damage =
      calcEffect(0) + self.additionalMetadata.auraPlatoonCount.Swordsmen * 2;
    sendToGameroom(`${name} heaved ${possessive} blade.`);
    flatAttack(damage);

    // remove swordsmen
    self.additionalMetadata.auraPlatoonCount.Swordsmen = 0;
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Swordsmen
      );
  },
});

const stolen_valor = new Card({
  title: "Stolen Valor",
  cardMetadata: { nature: Nature.Util, armyStrength: -15 },
  description: ([hp]) =>
    `Army Strength -15. Heal ${hp}HP + 2x #Shieldsbearer. Remove all Shieldsbearer afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [7],
  cardAction: function (
    this: Card,
    { self, calcEffect, name, possessive, sendToGameroom, flatSelfStat }
  ) {
    const heal =
      calcEffect(0) +
      self.additionalMetadata.auraPlatoonCount.Shieldbearers * 2;
    sendToGameroom(
      `${name} absorbed what remains of ${possessive} army's lifeforce.`
    );
    flatSelfStat(heal, StatsEnum.HP);

    // remove shieldsbearers
    self.additionalMetadata.auraPlatoonCount.Shieldbearers = 0;
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Shieldbearers
      );
  },
});

const heartbreaker = new Card({
  title: "Heartbreaker",
  cardMetadata: { nature: Nature.Attack, armyStrength: -15 },
  description: ([dmg]) =>
    `Army Strength -15. DMG ${dmg} + 2x #Archers with 50% Pierce. Remove all Archers afterwards.`,
  emoji: CardEmoji.AURA_CARD,
  effects: [7],
  hpCost: 8,
  cardAction: function (
    this: Card,
    { self, calcEffect, name, sendToGameroom, flatAttack }
  ) {
    const damage =
      calcEffect(0) + self.additionalMetadata.auraPlatoonCount.Archers * 2;
    sendToGameroom(`${name} aims for the heart.`);
    flatAttack(damage, 0.5);

    // remove archers
    self.additionalMetadata.auraPlatoonCount.Archers = 0;
    self.additionalMetadata.auraPlatoonQueue =
      self.additionalMetadata.auraPlatoonQueue.filter(
        (platoon) => platoon !== AuraPlatoon.Archers
      );
  },
});

export const auserlese = new Card({
  title: "Scales of Obedience - Auserlese",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: () =>
    `Roll a D100. If the result of the role > Opp's HP - Your HP, HP-10, change the target of your opponent's move that round. At this turn's end, if Your HP - Opp's HP >= 50, you win, and if Opp's HP - Your HP >= 50, you lose.`,
  priority: 13,
  emoji: CardEmoji.AURA_CARD,
  effects: [],
  cardAction: function (
    this: Card,
    {
      self,
      name,
      sendToGameroom,
      opponent,
      game,
      opponentStats,
      selfStats,
      opponentIndex,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} tried to manipulate the opponent's aims.`);

    const roll = Rolls.rollD100();
    const hpDiff = opponentStats.HP - selfStats.HP;
    sendToGameroom(`## **HP diff**: ${hpDiff}`);
    sendToGameroom(`# Roll: ${roll}`);

    if (roll > hpDiff) {
      sendToGameroom(`${name} forced a misdirection!`);
      game.additionalMetadata.auserleseContextReversal[opponentIndex] = true;
      flatSelfStat(10, StatsEnum.HP, -1);
    } else {
      sendToGameroom(`The incantation was not strong enough.`);
    }

    self.timedEffects.push(
      new TimedEffect({
        name: "Scales of Obedience - Auserlese",
        description: `If Your HP - Opp's HP >= 50, you win, and if Opp's HP - Your HP >= 50, you lose.`,
        priority: -13,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, characterIndex, _messageCache) => {
          // clean up
          game.additionalMetadata.auserleseContextReversal[opponentIndex] =
            false;

          // end of turn
          sendToGameroom(`The scale measures the oppositions' mana...`);
          const hpDiffAfter = opponentStats.HP - selfStats.HP;
          sendToGameroom(`## **HP diff**: ${hpDiffAfter}`);

          if (hpDiffAfter <= -50) {
            sendToGameroom(`${opponent.name} fell into ${name}'s control!`);
            game.additionalMetadata.forfeited[opponentIndex] = true;
          } else if (hpDiffAfter >= 50) {
            sendToGameroom(`${name} is shaken with fear...`);
            game.additionalMetadata.forfeited[characterIndex] = true;
          } else {
            sendToGameroom(
              "The scale doesn't tip in any meaningful direction..."
            );
          }
        },
      })
    );
  },
});

const auraDeck = [
  { card: rusted_blades, count: 2 },
  { card: weathered_shields, count: 2 },
  { card: broken_arrows, count: 2 },
  { card: fallen_empire, count: 1 },
  { card: retreat, count: 2 },
  { card: rot_over_open_wound, count: 1 },
  { card: loyalty, count: 2 },
  { card: decapitate, count: 1 },
  { card: stolen_valor, count: 1 },
  { card: heartbreaker, count: 1 },
  { card: auserlese, count: 1 },
];

export default auraDeck;
