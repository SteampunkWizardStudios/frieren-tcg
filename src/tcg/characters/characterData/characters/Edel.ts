import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import edelDeck from "@tcg/decks/EdelDeck";
import Pronouns from "@src/tcg/pronoun";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const edelStats = new Stats({
  [StatsEnum.HP]: 80,
  [StatsEnum.ATK]: 8,
  [StatsEnum.DEF]: 9,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 11,
  [StatsEnum.Ability]: 0,
});

const Edel = new CharacterData({
  name: CharacterName.Edel,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.EDEL,
    color: 0xae9292,
    imageUrl: mediaLinks.edelPortrait,
  },
  stats: edelStats,
  cards: edelDeck,
  ability: {
    abilityName: "A Superior Opponent",
    abilityEffectString:
      "While you make Eye Contact with the opponent, all your moves have Priority+1",
    subAbilities: [
      {
        name: "Memory Transference Specialist",
        description: "Your opponent's discards are visible.",
      },
    ],
    abilityStartOfTurnEffect: (game, characterIndex, messageCache) => {
      const self = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      opponent.additionalMetadata.publicDiscards = true; // enables Memory Transference Specialist

      // A Superior Opponent
      if (self.stats.stats.Ability > 0) {
        self.adjustStat(-1, StatsEnum.Ability, game);
        messageCache.push(
          `${self.name} made eye contact with ${opponent.name} - ${self.cosmetic.pronouns.possessive} moves gain **Priority+1**.`,
          TCGThread.Gameroom
        );

        self.ability.abilitySelectedMoveModifierEffect = (
          _game,
          _characterIndex,
          _messageCache,
          card
        ) => {
          card.priority += 1;
          return card;
        };
      } else {
        self.ability.abilitySelectedMoveModifierEffect = undefined;
      }
    },
  },
});

export default Edel;
