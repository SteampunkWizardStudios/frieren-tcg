import Card, { Nature } from "@tcg/card";
import TimedEffect from "@tcg/timedEffect";
import { StatsEnum } from "@tcg/stats";
import { CardEmoji } from "@tcg/formatting/emojis";
import {
  FlammeResearch,
  FlammeTheory,
} from "../additionalMetadata/gameAdditionalMetadata";
import { CharacterName } from "../characters/metadata/CharacterName";
import Character from "../character";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const incantationIncreaseSigil = (
  self: Character,
  messageCache: MessageCache,
  sigilCount: number
) => {
  const name = self.name;
  self.additionalMetadata.flammeSigil =
    (self.additionalMetadata.flammeSigil ?? 0) + sigilCount;
  messageCache.push(
    `${name} performed an incantation.\n${name} **gained ${sigilCount}** Sigil. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`,
    TCGThread.Gameroom
  );
};

const researchDecreaseSigil = (
  self: Character,
  messageCache: MessageCache,
  sigilCount: number
) => {
  const name = self.name;
  const possessive = self.cosmetic.pronouns.possessive;
  self.additionalMetadata.flammeSigil =
    (self.additionalMetadata.flammeSigil ?? 0) - sigilCount;
  messageCache.push(
    `${name} performed ${possessive} research.\n${name} *lost ${sigilCount}* Sigil. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`,
    TCGThread.Gameroom
  );
};

const incantationExperimentalNotes = new Card({
  title: "Incantation: Experimental Notes",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) =>
    `Heal ${hp} HP. Gain 5 Sigils. If you have less than 2 Flamme's Note cards in your hand, discard a random card, add 1 Flamme's Note from the active or discard pile to your hand.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5],
  cardAction: function (this: Card, context) {
    const {
      self,
      messageCache,
      game,
      name,
      possessive,
      sendToGameroom,
      selfStat,
    } = context;
    sendToGameroom(`${name} experiments with ${possessive} findings.`);
    selfStat(0, StatsEnum.HP, game);
    incantationIncreaseSigil(self, messageCache, 5);

    const flammesNoteCount = self.hand.filter(
      (card) => card.cardMetadata.isFlammesNote
    ).length;
    if (flammesNoteCount < 2) {
      self.discardRandomCard();

      let flammesNote: Card | undefined = undefined;
      const activePileFlammesNoteIndex = self.deck.activePile.findIndex(
        (card) => card.cardMetadata.isFlammesNote
      );
      if (activePileFlammesNoteIndex !== -1) {
        flammesNote = self.deck.activePile.splice(
          activePileFlammesNoteIndex,
          1
        )[0];
      } else {
        const discardPileFlammesNoteIndex = self.deck.discardPile.findIndex(
          (card) => card.cardMetadata.isFlammesNote
        );
        if (discardPileFlammesNoteIndex !== -1) {
          flammesNote = self.deck.discardPile.splice(
            discardPileFlammesNoteIndex,
            1
          )[0];
        }
      }

      if (flammesNote) {
        sendToGameroom(
          `${name} added ${flammesNote.title} to ${possessive} hand.`
        );
        self.hand.push(flammesNote);
      } else {
        sendToGameroom(
          `${name} couldn't find anything new. ${name} drew 1 card.`
        );
        self.drawCard();
      }
    }
  },
});

export const incantationFieldOfFlowers = new Card({
  title: "Incantation: Field of Flowers",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. Gain 3 Sigils. At the next 3 turns' ends, heal ${endHp} HP. Gain 2 Sigils at the end of every turn.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 3],
  cardAction: function (
    this: Card,
    {
      game,
      self,
      name,
      sendToGameroom,
      selfStat,
      calcEffect,
      messageCache,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} conjured a field of flowers.`);
    selfStat(0, StatsEnum.HP, game);

    const endOfTurnHealing = calcEffect(1);
    incantationIncreaseSigil(self, messageCache, 3);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP. Gain 2 Sigils.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (game, characterIndex, messageCache) => {
          const character = game.getCharacter(characterIndex);
          sendToGameroom(`The Field of Flowers soothe ${name}.`);
          flatSelfStat(endOfTurnHealing, StatsEnum.HP, game);
          incantationIncreaseSigil(character, messageCache, 2);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom("The Field of Flowers fade.");
        },
      })
    );
  },
});

const incantationSeductionTechnique = new Card({
  title: "Incantation: Seduction Technique",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, oppAtkDecrease, oppSpdDecrease]) =>
    `Heal ${hp} HP. Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. Gain 3 Sigils.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3, 2, 1],
  cardAction: function (this: Card, context) {
    const {
      self,
      messageCache,
      game,
      name,
      sendToGameroom,
      selfStat,
      opponentStat,
    } = context;
    sendToGameroom(`${name} showcases her seduction technique.`);
    selfStat(0, StatsEnum.HP, game);
    opponentStat(1, StatsEnum.ATK, game, -1);
    opponentStat(2, StatsEnum.SPD, game, -1);

    incantationIncreaseSigil(self, messageCache, 3);
  },
});

const milleniumBarrier = new Card({
  title: "Millenium Barrier",
  cardMetadata: { nature: Nature.Util },
  description: ([def, spd]) =>
    `DEF+${def} and SPD+${spd}. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5],
  cardAction: function (
    this: Card,
    { self, game, selfIndex, sendToGameroom, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`A barrier blankets the land.`);
    const defIncrease = calcEffect(0);
    const spdIncrease = calcEffect(1);
    flatSelfStat(defIncrease, StatsEnum.DEF, game);
    flatSelfStat(spdIncrease, StatsEnum.SPD, game);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.MilleniumBarrier
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Millenium Barrier",
        description: `DEF+${defIncrease}. SPD+${spdIncrease}. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (
          this: TimedEffect,
          game,
          _characterIndex,
          messageCache
        ) {
          self.additionalMetadata.flammeSigil ??= 0;

          if (self.additionalMetadata.flammeSigil > 0) {
            sendToGameroom("The barrier takes in mana.");
            researchDecreaseSigil(self, messageCache, 1);
          }

          this.turnDuration = self.additionalMetadata.flammeSigil;
        },
        endOfTimedEffectAction: function () {
          if (game.additionalMetadata.flammeTheory.Irreversibility) {
            sendToGameroom("The legacy of someone long gone remains unbroken.");
          } else {
            sendToGameroom("The barrier crumbles. It is yet strong enough.");
          }
          flatSelfStat(defIncrease, StatsEnum.DEF, game, -1);
          flatSelfStat(spdIncrease, StatsEnum.SPD, game, -1);
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.MilleniumBarrier
          ] = false;
        },
      })
    );
  },
});

const thousandYearSanctuary = new Card({
  title: "Thousand Year Sanctuary",
  cardMetadata: { nature: Nature.Util },
  description: ([oppAtkDecrease, oppSpdDecrease]) =>
    `Opp's ATK-${oppAtkDecrease} and SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5],
  cardAction: function (
    this: Card,
    {
      self,
      game,
      selfIndex,
      name,
      sendToGameroom,
      calcEffect,
      flatOpponentStat,
      flatSelfStat,
    }
  ) {
    sendToGameroom(`${name} raises a towering sanctuary.`);
    const oppAtkDecrease = calcEffect(0);
    const oppSpdDecrease = calcEffect(1);
    flatOpponentStat(oppAtkDecrease, StatsEnum.ATK, game, -1);
    flatOpponentStat(oppSpdDecrease, StatsEnum.SPD, game, -1);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.ThousandYearSanctuary
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Thousand Year Sanctuary",
        description: `Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (
          this: TimedEffect,
          game,
          _characterIndex,
          messageCache
        ) {
          self.additionalMetadata.flammeSigil ??= 0;

          if (self.additionalMetadata.flammeSigil > 0) {
            sendToGameroom("The sanctuary approaches equilibrium.");
            researchDecreaseSigil(self, messageCache, 1);
          }

          this.turnDuration = self.additionalMetadata.flammeSigil / 2;
        },
        endOfTimedEffectAction: function () {
          if (game.additionalMetadata.flammeTheory.Irreversibility) {
            sendToGameroom("The sanctuary watches quietly over the land.");
          } else {
            sendToGameroom("The sanctuary collapses. It is yet strong enough.");
          }
          flatOpponentStat(oppAtkDecrease, StatsEnum.ATK, game);
          flatOpponentStat(oppSpdDecrease, StatsEnum.SPD, game);
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.ThousandYearSanctuary
          ] = false;
        },
      })
    );
  },
});

const treeOfLife = new Card({
  title: "Tree of Life",
  cardMetadata: { nature: Nature.Util },
  description: ([hp]) =>
    `Heal ${hp} HP. Roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [10],
  cardAction: function (
    this: Card,
    { self, game, selfIndex, name, sendToGameroom, selfStat, flatSelfStat }
  ) {
    sendToGameroom(`${name} plants a sapling for someone 1000 years from now.`);
    selfStat(0, StatsEnum.HP, game);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.TreeOfLife
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Tree of Life",
        description: `Roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: function (
          this: TimedEffect,
          game,
          _characterIndex,
          messageCache
        ) {
          self.additionalMetadata.flammeSigil ??= 0;

          if (self.additionalMetadata.flammeSigil > 0) {
            sendToGameroom("The tree flutters.");
            researchDecreaseSigil(self, messageCache, 1);
          }

          this.turnDuration = self.additionalMetadata.flammeSigil;
        },
        endOfTimedEffectAction: function () {
          sendToGameroom("The tree stands strong and unmoving.");
          game.additionalMetadata.flammeResearch[selfIndex][
            FlammeResearch.TreeOfLife
          ] = false;
        },
      })
    );
  },
});

const flammesNote = new Card({
  title: "Flamme's Note",
  cardMetadata: { nature: Nature.Util, isFlammesNote: true },
  description: ([hp]) =>
    `HP+${hp}. Discard a random card. If there is no Theory card in your deck, draw 1 card. Otherwise, add a random Theory card to your hand, and if Theory of Souls is not active, -1 Sigil.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [8],
  cardAction: function (
    this: Card,
    {
      self,
      game,
      messageCache,
      name,
      characterName,
      personal,
      selfStat,
      sendToGameroom,
    }
  ) {
    const isFlamme = characterName === CharacterName.Flamme;
    if (isFlamme) {
      sendToGameroom(`Flamme formulated a theory and notes down her research.`);
    } else {
      sendToGameroom(
        `${name} shuffles through Flamme's notes. ${name} drew 1 card.`
      );
    }
    self.discardRandomCard();
    selfStat(0, StatsEnum.HP, game);

    // collect theory
    const theoriesIndices: Array<[Card[], number]> = [];
    self.deck.activePile.forEach((card, i) => {
      if (card.cardMetadata.theory) {
        theoriesIndices.push([self.deck.activePile, i]);
      }
    });
    self.deck.discardPile.forEach((card, i) => {
      if (card.cardMetadata.theory) {
        theoriesIndices.push([self.deck.discardPile, i]);
      }
    });

    if (theoriesIndices.length > 0) {
      const randomTheoryIndex = Math.floor(
        Math.random() * theoriesIndices.length
      );
      const [pile, pileIndex] = theoriesIndices[randomTheoryIndex];

      const theoryCard = pile.splice(pileIndex, 1)[0];
      sendToGameroom(`${name} formulated the **${theoryCard.title}**.`);
      self.hand.push(theoryCard);

      if (!game.additionalMetadata.flammeTheory.Soul) {
        researchDecreaseSigil(self, messageCache, 1);
      }
    } else {
      sendToGameroom(
        `It doesn't seem like ${personal} found anything ${personal} doesn't already know. ${name} draws 1 card.`
      );
      self.drawCard();
    }
  },
});

const primitiveDefensiveTechnique = new Card({
  title: "Primitive Defensive Technique",
  cardMetadata: { nature: Nature.Defense },
  description: ([def]) =>
    `TrueDEF+${def} for 1 turn. -1 Sigil. If "Pinnacle of Humanity's Magic" is in your hand, discard it, then draw 1 card.`,
  emoji: CardEmoji.FLAMME_CARD,
  priority: 2,
  effects: [20],
  cardAction: function (
    this: Card,
    { game, name, self, sendToGameroom, calcEffect }
  ) {
    sendToGameroom(`${name} quickly put up a primitive emergency barrier.`);

    const def = calcEffect(0);
    self.adjustStat(def, StatsEnum.TrueDEF, game);
    researchDecreaseSigil(self, game.messageCache, 1);

    const index = self.hand.findIndex((card) => card.cardMetadata.isPinnacle);
    if (index !== -1) {
      self.discardCard(index);
      self.drawCard();
    }

    self.timedEffects.push(
      new TimedEffect({
        name: "Primitive Defensive Technique",
        description: `Increases TrueDEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        metadata: { removableBySorganeil: false },
        endOfTimedEffectAction: (_game, _characterIndex) => {
          self.adjustStat(-def, StatsEnum.TrueDEF, game);
        },
      })
    );
  },
});

const theoryOfIrreversibility = new Card({
  title: "Theory of Irreversibility",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `All stat changes for both players are halved. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility]) {
      sendToGameroom(
        `${name} discovered the Theory of Irreversibility. **All stat changes for both players are halved.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Irreversibility] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Irreversibility. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfBalance = new Card({
  title: "Theory of Balance",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `The Empower level for all card is now equal to the Turn Count. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Balance]) {
      sendToGameroom(
        `${name} discovered the Theory of Balance. **The Empower level for all card is now equal to the Turn Count.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Balance] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Balance. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfPrescience = new Card({
  title: "Theory of Prescience",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Prescience]) {
      sendToGameroom(
        `${name} discovered the Theory of Prescience. **The roll of the first 4 dices for both players for which cards are active for any given turn will always be 0, 1, 2, 3.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Prescience] = true;
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Prescience. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const theoryOfSoul = new Card({
  title: "Theory of Soul",
  cardMetadata: {
    nature: Nature.Util,
    theory: true,
    removeOnPlay: true,
    hideEmpower: true,
  },
  description: () =>
    `Both players swap their own active and discard piles. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: function (
    this: Card,
    { game, name, sendToGameroom, self, opponent }
  ) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Soul]) {
      sendToGameroom(
        `${name} discovered the Theory of Soul. **Both players swap their own active and discard piles.**`
      );
      game.additionalMetadata.flammeTheory[FlammeTheory.Soul] = true;

      [self.deck.activePile, self.deck.discardPile] = [
        self.deck.discardPile,
        self.deck.activePile,
      ];
      [opponent.deck.activePile, opponent.deck.discardPile] = [
        opponent.deck.discardPile,
        opponent.deck.activePile,
      ];
    } else {
      sendToGameroom(
        `${name} attempted to discover the Theory of Soul. But seems like it's already been discovered by someone else...`
      );
    }
  },
});

const flammeDeck = [
  { card: incantationExperimentalNotes, count: 3 },
  { card: incantationFieldOfFlowers, count: 2 },
  { card: incantationSeductionTechnique, count: 2 },
  { card: milleniumBarrier, count: 2 },
  { card: thousandYearSanctuary, count: 2 },
  { card: treeOfLife, count: 1 },
  { card: flammesNote, count: 2 },
  { card: primitiveDefensiveTechnique, count: 2 },
  { card: theoryOfIrreversibility, count: 1 },
  { card: theoryOfBalance, count: 1 },
  { card: theoryOfPrescience, count: 1 },
  { card: theoryOfSoul, count: 1 },
];

export default flammeDeck;
