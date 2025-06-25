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
import mediaLinks from "../formatting/mediaLinks";
import {
  a_foundationOfHumanitysMagicBase,
  a_firstPageOfHumanitysMagicBase,
  a_secondPageOfHumanitysMagicBase,
  a_thirdPageOfHumanitysMagicBase,
  a_lastPageOfHumanitysMagicBase,
} from "./utilDecks/flammeFoundationStage";
import incantationFieldOfFlowers from "./utilDecks/flammeSignature";

export const incantationIncreaseSigil = (
  self: Character,
  messageCache: MessageCache,
  sigilCount: number
) => {
  const name = self.name;
  self.additionalMetadata.flammeSigil =
    (self.additionalMetadata.flammeSigil ?? 0) + sigilCount;
  messageCache.push(
    `${name} performed an incantation. ${name} **gained ${sigilCount}** Sigil. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`,
    TCGThread.Gameroom
  );
};

export const researchDecreaseSigil = (
  self: Character,
  messageCache: MessageCache,
  sigilCount: number,
  customMessage?: string
) => {
  const name = self.name;
  const possessive = self.cosmetic.pronouns.possessive;
  self.additionalMetadata.flammeSigil =
    (self.additionalMetadata.flammeSigil ?? 0) - sigilCount;
  let message = "";
  if (customMessage) {
    message += customMessage;
  } else {
    message += `${name} performed ${possessive} research.`;
  }
  messageCache.push(
    `${message} ${name} *lost ${sigilCount}* Sigil. Current Sigil count: **${self.additionalMetadata.flammeSigil}**.`,
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
    const { self, messageCache, name, possessive, sendToGameroom, selfStat } =
      context;
    sendToGameroom(`${name} experiments with ${possessive} findings.`);
    selfStat(0, StatsEnum.HP);
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

const incantationSeductionTechnique = new Card({
  title: "Incantation: Seduction Technique",
  cardMetadata: { nature: Nature.Util },
  description: ([hp, oppAtkDecrease, oppSpdDecrease]) =>
    `Heal ${hp} HP. Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. Gain 3 Sigils.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [3, 2, 1],
  cosmetic: {
    cardGif: mediaLinks.flamme_seduction_gif,
  },
  cardAction: function (this: Card, context) {
    const { self, messageCache, name, sendToGameroom, selfStat, opponentStat } =
      context;
    sendToGameroom(`${name} showcases her seduction technique.`);
    selfStat(0, StatsEnum.HP);
    opponentStat(1, StatsEnum.ATK, -1);
    opponentStat(2, StatsEnum.SPD, -1);

    incantationIncreaseSigil(self, messageCache, 3);
  },
});

const milleniumBarrier = new Card({
  title: "Millenium Barrier",
  cardMetadata: { nature: Nature.Util },
  description: ([def, spd]) =>
    `DEF+${def} and SPD+${spd}. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0. If you were attacked this turn, -1 Sigil. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5],
  cardAction: function (
    this: Card,
    { self, game, selfIndex, sendToGameroom, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`A barrier blankets the land.`);
    const defIncrease = calcEffect(0);
    const spdIncrease = calcEffect(1);
    flatSelfStat(defIncrease, StatsEnum.DEF);
    flatSelfStat(spdIncrease, StatsEnum.SPD);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.MilleniumBarrier
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Millenium Barrier",
        description: `DEF+${defIncrease}. SPD+${spdIncrease}. If Theory of Irreversibilty is active, all opponent's stat increases are set to 0. -1 Sigil if attacked this turn.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true, consumesFlammeSigil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        priority: -2,
        endOfTurnAction: function (
          this: TimedEffect,
          _game,
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
          flatSelfStat(defIncrease, StatsEnum.DEF, -1);
          flatSelfStat(spdIncrease, StatsEnum.SPD, -1);
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
    `Opp's ATK-${oppAtkDecrease} and SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing. If you were attacked this turn, -1 Sigil. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 5],
  cosmetic: {
    cardGif: mediaLinks.flamme_sanctuary_gif,
  },
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
    }
  ) {
    sendToGameroom(`${name} raises a towering sanctuary.`);
    const oppAtkDecrease = calcEffect(0);
    const oppSpdDecrease = calcEffect(1);
    flatOpponentStat(oppAtkDecrease, StatsEnum.ATK, -1);
    flatOpponentStat(oppSpdDecrease, StatsEnum.SPD, -1);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.ThousandYearSanctuary
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Thousand Year Sanctuary",
        description: `Opp's ATK-${oppAtkDecrease}. Opp's SPD-${oppSpdDecrease}. If Theory of Balance is active, the turn count stops increasing. -1 Sigil if attacked this turn.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true, consumesFlammeSigil: true },
        executeEndOfTimedEffectActionOnRemoval: true,
        priority: -2,
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

          this.turnDuration = self.additionalMetadata.flammeSigil;
        },
        endOfTimedEffectAction: function () {
          if (game.additionalMetadata.flammeTheory.Irreversibility) {
            sendToGameroom("The sanctuary watches quietly over the land.");
          } else {
            sendToGameroom("The sanctuary collapses. It is yet strong enough.");
          }
          flatOpponentStat(oppAtkDecrease, StatsEnum.ATK);
          flatOpponentStat(oppSpdDecrease, StatsEnum.SPD);
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
    `Heal ${hp} HP. Roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5. If you were attacked this turn, -1 Sigil. At the end of every turn, -1 Sigil. This effect lasts until the number of Sigil you have is <= 0.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [10],
  cosmetic: {
    cardGif: mediaLinks.flamme_treeOfLife_gif,
  },
  cardAction: function (
    this: Card,
    { self, game, selfIndex, name, sendToGameroom, selfStat }
  ) {
    sendToGameroom(`${name} plants a sapling for someone 1000 years from now.`);
    selfStat(0, StatsEnum.HP);

    const sigilCount = self.additionalMetadata.flammeSigil ?? 0;
    game.additionalMetadata.flammeResearch[selfIndex][
      FlammeResearch.TreeOfLife
    ] = true;

    self.timedEffects.push(
      new TimedEffect({
        name: "Tree of Life",
        description: `Roll an additional dice during card activation phase. If Theory of Prescience is active, this roll of dice will always be 5. -1 Sigil if attacked this turn.`,
        turnDuration: sigilCount,
        metadata: { removableBySorganeil: true, consumesFlammeSigil: true },
        priority: -2,
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
  cosmetic: {
    cardGif: mediaLinks.flamme_flammesNotes_gif,
  },
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
    selfStat(0, StatsEnum.HP);

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
  description: ([def]) => `TrueDEF+${def} for 1 turn.`,
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
    `All ATK/DEF/SPD changes for both players are halved. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory_gif,
  },
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
    `The Empower level for all card is now equal to half of the Turn Count. Remove this card from the deck once it is used.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cosmetic: {
    cardGif: mediaLinks.flamme_theory_gif,
  },
  cardAction: function (this: Card, { game, name, sendToGameroom }) {
    if (!game.additionalMetadata.flammeTheory[FlammeTheory.Balance]) {
      sendToGameroom(
        `${name} discovered the Theory of Balance. **The Empower level for all card is now equal to half of the Turn Count.**`
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
  cosmetic: {
    cardGif: mediaLinks.flamme_theory2_gif,
  },
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
  cosmetic: {
    cardGif: mediaLinks.flamme_theory2_gif,
  },
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

export const a_foundationOfHumanitysMagic = new Card({
  title: "Foundation of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: () =>
    "This card's effect changes based on how many Theory cards you have played.",
  emoji: CardEmoji.FLAMME_CARD,
  effects: [],
  cardAction: () => {},
  conditionalTreatAsEffect: function (this: Card, game, characterIndex) {
    const character = game.characters[characterIndex];

    if (character.stats.stats.Ability === 0) {
      return new Card({
        ...a_foundationOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 1) {
      return new Card({
        ...a_firstPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 2) {
      return new Card({
        ...a_secondPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else if (character.stats.stats.Ability === 3) {
      return new Card({
        ...a_thirdPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    } else {
      return new Card({
        ...a_lastPageOfHumanitysMagicBase,
        empowerLevel: this.empowerLevel,
      });
    }
  },
});

const flammeDeck = [
  { card: a_foundationOfHumanitysMagic, count: 3 },
  { card: incantationExperimentalNotes, count: 2 },
  { card: incantationFieldOfFlowers, count: 2 },
  { card: incantationSeductionTechnique, count: 2 },
  { card: milleniumBarrier, count: 1 },
  { card: thousandYearSanctuary, count: 1 },
  { card: treeOfLife, count: 1 },
  { card: flammesNote, count: 2 },
  { card: primitiveDefensiveTechnique, count: 2 },
  { card: theoryOfIrreversibility, count: 1 },
  { card: theoryOfBalance, count: 1 },
  { card: theoryOfPrescience, count: 1 },
  { card: theoryOfSoul, count: 1 },
];

export default flammeDeck;
