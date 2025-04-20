import Card, { Nature } from "../../card"
import CommonCardAction from "../../util/commonCardActions";
import { CardEmoji } from "../../formatting/emojis";
import { MessageCache } from "../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../tcgChatInteractions/sendGameMessage";

export const a_malevolentShrine = new Card({
  title: "Malevolent Shrine",
  description: ([dmg]) =>
    `HP-11. Has a 80% of missing if the opponent didn't attack last turn. DMG ${dmg}.`,
  cosmetic: {
    cardGif: "https://media.discordapp.net/attachments/1338831179981262943/1363264315272073406/malevolent-shrine-ubel.gif?ex=68060f14&is=6804bd94&hm=300b3e5578f56a069ea858f0f660ce855be6a3f6f32f246b434066ea770da58e&=&width=400&height=225",
  },
  emoji: CardEmoji.UBEL_CARD,
  cardMetadata: { nature: Nature.Attack, signature: true, ubelFailureRate: 80 },
  effects: [22],
  hpCost: 11,
  cardAction: function (
    this: Card,
    game,
    characterIndex,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor = (character.additionalMetadata.pierceFactor ??= 0);
    messageCache.push(
      `# ጠ ል ረ ቿ ሀ ዐ ረ ቿ ክ ፕ    ነ ዘ ዪ ጎ ክ ቿ!`,
      TCGThread.Gameroom
    );

    CommonCardAction.pierceAttack(game, characterIndex, {
      damage: this.calculateEffectValue(this.effects[0]),
      hpCost: this.hpCost,
      pierceFactor: pierceFactor,
    });
  },
});