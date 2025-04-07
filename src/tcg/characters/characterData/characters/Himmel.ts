import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { himmelDeck } from "../../../decks/HimmelDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "../../../formatting/emojis";

const HIMMEL_HERO_PARTY_DAMAGE_BONUS = 0.2;

const imageUrl: Record<string, string> = {
  icon: "https://static.wikia.nocookie.net/frieren/images/9/96/Himmel_anime_portrait.png/revision/latest?cb=20231017083515",
};

const himmelStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 16.0,
  [StatsEnum.Ability]: 0.0,
});

export const Himmel = new CharacterData({
  name: CharacterName.Himmel,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.HIMMEL,
    color: 0xb4c9e7,
    imageUrl: imageUrl.icon,
  },
  stats: himmelStats,
  cards: himmelDeck,
  ability: {
    abilityName: "The Hero Party",
    abilityEffectString: `For each one of Frieren/Heiter/Eisen active as a timed effect,
        all of this character's attacks and timed effect attacks deal an additional ${(HIMMEL_HERO_PARTY_DAMAGE_BONUS * 100).toFixed(2)}% damage.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];
      character.setStat(
        character.timedEffects.length,
        StatsEnum.Ability,
        false
      );
    },
    abilityAttackEffect(game, characterIndex, _messageCache) {
      const character = game.getCharacter(characterIndex);
      game.additionalMetadata.attackModifier[characterIndex] =
        1 + HIMMEL_HERO_PARTY_DAMAGE_BONUS * character.timedEffects.length;
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
  },
});
