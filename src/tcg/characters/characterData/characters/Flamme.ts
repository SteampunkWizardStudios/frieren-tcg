import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import flammeDeck from "@src/tcg/decks/FlammeDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import Game from "@src/tcg/game";
import Card from "@src/tcg/card";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import TimedEffect from "@src/tcg/timedEffect";

const flammeStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 4.0,
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
    abilityEffectString: `The Foundation of Humanity's Magic gets more developed for each Theory card you play.`,
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
        character.setStat(99, StatsEnum.Ability);
      }

      // sigil timed effects cleanup
      character.additionalMetadata.flammeSigil ??= 0;
      if (character.additionalMetadata.flammeSigil <= 0) {
        const newTimedEffects: TimedEffect[] = [];
        character.timedEffects.map((timedEffect) => {
          if (!timedEffect.metadata.consumesFlammeSigil) {
            newTimedEffects.push(timedEffect);
          } else {
            if (
              timedEffect.executeEndOfTimedEffectActionOnRemoval &&
              timedEffect.endOfTimedEffectAction
            ) {
              timedEffect.endOfTimedEffectAction(
                game,
                characterIndex,
                messageCache
              );
            }
          }
        });
        character.timedEffects = newTimedEffects;
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
