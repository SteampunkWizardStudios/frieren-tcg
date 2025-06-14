import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import Pronouns from "@tcg/pronoun";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import mediaLinks from "@tcg/formatting/mediaLinks";
import methodeDeck from "@decks/MethodeDeck";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const methodeStats = new Stats({
  [StatsEnum.HP]: 100,
  [StatsEnum.ATK]: 12,
  [StatsEnum.DEF]: 12,
  [StatsEnum.TrueDEF]: 0,
  [StatsEnum.SPD]: 10,
  [StatsEnum.Ability]: 0,
});

const Methode = new CharacterData({
  characterName: CharacterName.Methode,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.METHODE,
    color: 0x8a2be2, // default
    imageUrl: mediaLinks.edelPortrait, // default
  },
  stats: methodeStats,
  cards: methodeDeck,
  ability: {
    abilityName: "Jack-of-all-trades",
    abilityEffectString: "Roll an extra die",
    subAbilities: [
      {
        name: '"I think you\'re cute"',
        description:
          "ATK+1 and DEF-1 against Frieren, Fern, Serie and Edel on the first turn.",
      },
    ],
    abilityStartOfTurnEffect: (game, characterIndex, messageCache) => {
      const self = game.getCharacter(characterIndex);
      const opp = game.getCharacter(1 - characterIndex);

      switch (game.turnCount) {
        case 1:
          {
            if (!opp.additionalMetadata.methodeFindsCute) return;

            messageCache.push(
              `${self.name} finds ${opp.name} cute!`,
              TCGThread.Gameroom
            );
            self.adjustStat(1, StatsEnum.ATK, game);
            self.adjustStat(-1, StatsEnum.DEF, game);
          }
          break;
        case 2:
          {
            messageCache.push(
              `${self.name}'s adoration for ${opp.name} has worn off.`,
              TCGThread.Gameroom
            );
            self.adjustStat(-1, StatsEnum.ATK, game);
            self.adjustStat(1, StatsEnum.DEF, game);
          }
          break;
      }
    },
  },

  additionalMetadata: {
    rollsCount: 5,
  },
});

export default Methode;
