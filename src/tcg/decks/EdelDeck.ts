import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import Character from "@tcg/character";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "../timedEffect";

const redrawRandom = (opponent: Character) => {
  const randomIndex = Math.floor(Math.random() * opponent.hand.length);
  opponent.discardCard(randomIndex);
  opponent.drawCard();
};

export const telekinesis = new Card({
  title: "Telekinesis",
  cardMetadata: { nature: Nature.Attack },
  emoji: CardEmoji.EDEL_CARD,
  cosmetic: {
    cardGif:
      "https://media.discordapp.net/attachments/1367328754795286599/1368285080606347444/Stone_hurling_spell_EP24.gif?ex=6817aa48&is=681658c8&hm=b41474c8c6b45cfcf6d65a0d1f5586e9633d1d064f0ee1ab4facd0d9b3699a84",
  },
  description: ([dmg]) => `HP-8. The opponent redraws 2 cards. DMG ${dmg}.`,
  effects: [14],
  cardAction: ({ name, opponent, sendToGameroom, basicAttack }) => {
    sendToGameroom(`${name} used a telekinetic attack!`);

    for (let i = 0; i < 2; i++) {
      redrawRandom(opponent);
    }

    basicAttack(0, 8);
  },
});

const one_step_ahead = new Card({
  title: "One Step Ahead",
  cardMetadata: { nature: Nature.Defense },
  emoji: CardEmoji.EDEL_CARD,
  description: ([def, spd, dmg]) =>
    `Priority+3. DEF+${def} for 1 turn. If this card is played the same turn your opponent plays a defensive card, their SPD-${spd}, they redraw 1 card, and attack with DMG ${dmg} ignoring all defense.`,
  effects: [20, 2, 10],
  priority: 3,
  cardAction: ({
    self,
    opponent,
    name,
	calcEffect,
    sendToGameroom,
    selfStat,
    opponentStat,
    basicAttack,
  }) => {
    sendToGameroom(`${name} put up a full coverage defense.`);
    selfStat(0, StatsEnum.DEF);

	const def = calcEffect(0)

    self.timedEffects.push(
      new TimedEffect({
        name: "Full Coverage Defense",
        description: `Increases DEF by ${def} until the end of the turn.`,
        priority: -1,
        turnDuration: 1,
        removableBySorganeil: false,
        endOfTimedEffectAction: (game, characterIndex) => {
          game.characters[characterIndex].adjustStat(-def, StatsEnum.DEF);
        },
      })
    );

    if (
      opponent.additionalMetadata.selectedCard?.cardMetadata.nature !==
      Nature.Defense
    ) {
      return;
    }

    sendToGameroom(
      `${opponent.name} is playing a defensive card. ${name} read ${opponent.cosmetic.pronouns.possessive} mind!`
    );
    opponentStat(1, StatsEnum.SPD, -1);
    redrawRandom(opponent);
    basicAttack(2, 0, 1);
  },
});

const edelDeck = [
  { card: telekinesis, count: 8 },
  { card: one_step_ahead, count: 8 },
];

export default edelDeck;
