import Card, { Nature } from "../../card";
import { StatsEnum } from "../../stats";
import TimedEffect from "../../timedEffect";
import { CardEmoji } from "../../formatting/emojis";
import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";

export const ancientBarrierMagic = new Card({
  title: "Ancient Barrier Magic",
  description: ([atk, def, oppSpd]) =>
    `HP-15. ATK+${atk} for 7 turns. Opponent's DEF-${def} for 7 turns. Opponent's SPD -${oppSpd} for 7 turns.`,
  emoji: CardEmoji.SERIE_CARD,
  cosmetic: {
    cardImageUrl:
      "https://cdn.discordapp.com/attachments/1351391350398128159/1352873014080966718/Ancient_Barrier_Magic_1.png?ex=67df98ad&is=67de472d&hm=c0b00575790207a93d00398d3351e5cd914f371b0c2118855f8f2dc259634420&",
    cardGif:
      "https://cdn.discordapp.com/attachments/1360969158623232300/1365090141374513232/IMG_6559.gif?ex=680cb383&is=680b6203&hm=319be760a6a351a675a1f82ed84fc6cc78063ab4f302f01e5f00d677de814937&",
  },
  cardMetadata: { nature: Nature.Util, signature: true },
  effects: [5, 5, 5],
  cardAction: function (this: Card, game, characterIndex, messageCache) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `${character.name} expanded an ancient barrier magic.`,
      TCGThread.Gameroom
    );

    if (character.adjustStat(-15, StatsEnum.HP)) {
      const opponent = game.getCharacter(1 - characterIndex);
      const atkBuff = this.calculateEffectValue(this.effects[0]);
      const defDebuff = this.calculateEffectValue(this.effects[1]);
      const spdDebuff = this.calculateEffectValue(this.effects[2]);

      character.adjustStat(atkBuff, StatsEnum.ATK);
      opponent.adjustStat(-1 * defDebuff, StatsEnum.DEF);
      opponent.adjustStat(-1 * spdDebuff, StatsEnum.SPD);

      character.timedEffects.push(
        new TimedEffect({
          name: "Ancient Barrier Magic",
          description: `An ominous barrier envelopes the battlefield...`,
          turnDuration: 7,
          priority: -1,
          endOfTimedEffectAction: (_game, _characterIndex) => {
            messageCache.push("The barrier dissipated.", TCGThread.Gameroom);

            character.adjustStat(-1 * atkBuff, StatsEnum.ATK);
            opponent.adjustStat(defDebuff, StatsEnum.DEF);
            opponent.adjustStat(spdDebuff, StatsEnum.SPD);
          },
        })
      );
    }
  },
});
