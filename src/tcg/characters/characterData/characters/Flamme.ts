import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import flammeDeck from "@src/tcg/decks/FlammeDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CardEmoji, CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@src/tcg/game";
import Card, { Nature } from "@src/tcg/card";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

export const a_pinnacleOfHumanitysMagic = new Card({
  title: "Pinnacle of Humanity's Magic",
  cardMetadata: { nature: Nature.Attack },
  description: ([stat]) =>
    `ATK+${stat} DEF+${stat} SPD+${stat}. Deal ${stat} DMG.`,
  emoji: CardEmoji.FLAMME_CARD,
  priority: 100,
  effects: [100],
  cardAction: function (
    this: Card,
    { game, sendToGameroom, selfStat, flatSelfStat, basicAttack }
  ) {
    sendToGameroom(`The Pinnacle of Humanity's Magic is on display.`);
    flatSelfStat(1, StatsEnum.Ability, game);
    selfStat(0, StatsEnum.ATK, game);
    selfStat(0, StatsEnum.DEF, game);
    selfStat(0, StatsEnum.SPD, game);
    basicAttack(0);
  },
});

const flammeStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

const Flamme = new CharacterData({
  characterName: CharacterName.Flamme,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.FLAMME,
    color: 0xde8a54,
    imageUrl: mediaLinks.flammePortrait,
  },
  stats: flammeStats,
  cards: flammeDeck,
  ability: {
    abilityName: "Founder of Humanity's Magic",
    abilityEffectString: `After playing 4 Theory cards, add 1 "Pinnacle of Humanity's Magic" to your Discard pile.\n*Pinnacle of Humanity's Magic*: Priority+100. ATK+**100** DEF+**100** SPD+**100**. Deal **100** DMG.`,
    subAbilities: [
      {
        name: "Deceitful",
        description:
          "This character's stat is always displayed as 10/1/1/1. This character can also see past the opponent's Mana Suppression.",
      },
    ],
    abilityAfterOwnCardUse: function (
      game: Game,
      characterIndex: number,
      _messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.theory) {
        character.adjustStat(1, StatsEnum.Ability, game);
      }
    },
    abilityEndOfTurnEffect: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache
    ) {
      const character = game.getCharacter(characterIndex);
      if (character.stats.stats.Ability === 4) {
        messageCache.push(
          "Flamme is close to a major discovery...",
          TCGThread.Gameroom
        );
        messageCache.push(
          `*Pinnacle of Humanity's Magic* has been added to ${character.name}'s Discard pile.`,
          TCGThread.Gameroom
        );
        character.deck.discardPile.push(a_pinnacleOfHumanitysMagic.clone());
        character.setStat(99, StatsEnum.Ability);
      }
    },
  },
  additionalMetadata: {
    deceitful: true,
    ignoreManaSuppressed: true,
    defenderDamageScaling: 1,
  },
});

export default Flamme;
