import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "../../../formatting/emojis";
import { denkenDeck } from "@src/tcg/decks/DenkenDeck";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";

const DENKEN_STEEL_YOURSELF_TURN_COUNT = 3;

const denkenStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 11.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

export const Denken = new CharacterData({
  name: CharacterName.Denken,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.DENKEN,
    color: 0x82574f,
    imageUrl:
      "https://static.wikia.nocookie.net/frieren/images/5/5c/Denken_anime_portrait.png/revision/latest?cb=20240112114340",
  },
  stats: denkenStats,
  cards: denkenDeck,
  ability: {
    abilityName: "Steel Yourself",
    abilityEffectString: `This character only loses after their HP is <= 0 for ${DENKEN_STEEL_YOURSELF_TURN_COUNT} turns in a row.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];

      if (character.stats.stats.HP > 0) {
        character.setStat(3, StatsEnum.Ability, false);
      }
    },
    abilityEndOfTurnEffect: function (
      this,
      game,
      characterIndex,
      messageCache
    ) {
      const character = game.characters[characterIndex];

      if (character.stats.stats.HP <= 0) {
        character.adjustStat(-1, StatsEnum.Ability);
        if (character.stats.stats.Ability > 0) {
          messageCache.push(`Denken steels himself!`, TCGThread.Gameroom);
        } else {
          messageCache.push(`Denken's strength fades.`, TCGThread.Gameroom);
          game.additionalMetadata.forfeited[characterIndex] = true;
        }
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    ignoreManaSuppressed: false,
    defenseDamageReduction: 0,
  },
});
