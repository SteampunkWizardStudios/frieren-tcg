import Card, { Nature } from "@tcg/card";
import CommonCardAction from "@tcg/util/commonCardActions";
import { CardEmoji } from "@tcg/formatting/emojis";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

export const a_malevolentShrine = new Card({
  title: "Reelseiden: Malevolent Shrine",
  description: ([dmg, atkSpd]) =>
    `DMG ${dmg}. If used by Übel, has a 80% of missing if the opponent didn't use an Attack card before this move is used. If the attack misses, ATK+${atkSpd}, SPD+${atkSpd}.`,
  cosmetic: {
    cardGif:
      "https://media.discordapp.net/attachments/1338831179981262943/1363264315272073406/malevolent-shrine-ubel.gif?ex=68060f14&is=6804bd94&hm=300b3e5578f56a069ea858f0f660ce855be6a3f6f32f246b434066ea770da58e&=&width=400&height=225",
  },
  emoji: CardEmoji.UBEL_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true, ubelFailureRate: 80 },
  effects: [22, 5],
  hpCost: 11,
  cardAction: function (
    this: Card,
    { game, selfIndex: characterIndex, messageCache }
  ) {
    const character = game.getCharacter(characterIndex);
    messageCache.push(
      `# ጠ ል ረ ቿ ሀ ዐ ረ ቿ ክ ፕ    ነ ዘ ዪ ጎ ክ ቿ!`,
      TCGThread.Gameroom
    );

    CommonCardAction.commonAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      additionalPierceFactor:
        character.additionalMetadata.ubelSlashMovesPierceFactor,
    });
  },
});
