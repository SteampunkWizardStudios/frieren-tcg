import Card, { Nature } from "@tcg/card";
import { CardEmoji } from "@tcg/formatting/emojis";
import mediaLinks from "@tcg/formatting/mediaLinks";
import { StatsEnum } from "@tcg/stats";
import TimedEffect from "@tcg/timedEffect";

const incantationFieldOfFlowers = new Card({
  title: "Incantation: Field of Flowers",
  cardMetadata: { nature: Nature.Util, signature: true },
  description: ([hp, endHp]) =>
    `Heal ${hp} HP. At the next 3 turns' ends, heal ${endHp} HP.`,
  emoji: CardEmoji.FLAMME_CARD,
  effects: [5, 3],
  cosmetic: {
    cardGif: mediaLinks.flamme_fieldOfFlower_gif,
  },
  cardAction: function (
    this: Card,
    { self, name, sendToGameroom, selfStat, calcEffect, flatSelfStat }
  ) {
    sendToGameroom(`${name} conjured a field of flowers.`);
    selfStat(0, StatsEnum.HP);

    const endOfTurnHealing = calcEffect(1);

    self.timedEffects.push(
      new TimedEffect({
        name: "Field of Flowers",
        description: `Heal ${endOfTurnHealing} HP.`,
        turnDuration: 3,
        executeEndOfTimedEffectActionOnRemoval: true,
        endOfTurnAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom(`The Field of Flowers soothe ${name}.`);
          flatSelfStat(endOfTurnHealing, StatsEnum.HP);
        },
        endOfTimedEffectAction: (_game, _characterIndex, _messageCache) => {
          sendToGameroom("The Field of Flowers fade.");
        },
      })
    );
  },
});

export default incantationFieldOfFlowers;
