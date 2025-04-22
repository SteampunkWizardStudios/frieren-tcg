import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { laufenDeck } from "../../../decks/LaufenDeck";
import Rolls from "../../../util/rolls";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const laufenStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 7.0,
  [StatsEnum.SPD]: 30.0,
  [StatsEnum.Ability]: 0.0,
});

export const Laufen = new CharacterData({
  name: CharacterName.Laufen,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.LAUFEN,
    color: 0xcf7457,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1346694607467184179/Laufen_anime_portrait.webp?ex=67dce516&is=67db9396&hm=c8439cdb36a948bfa707b18d46177518aac79300021391b77791d2ba30985947&",
  },
  stats: laufenStats,
  cards: laufenDeck,
  ability: {
    abilityName: "Graze",
    abilityEffectString: `DMG to this character is reduced by (this character's SPD - the opponent's SPD)%.
        The minimum damage reduction is 0%, and the maximum is 100%.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache
    ) {
      const character = game.characters[characterIndex];
      const opponent = game.getCharacter(1 - characterIndex);
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;

      character.setStat(spdDiff, StatsEnum.Ability, false);
    },
    abilityDefendEffect: (
      game,
      characterIndex,
      _messageCache,
      _attackDamage
    ) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      const damageReduction = Math.min(Math.max(spdDiff / 100, 0), 1);
      character.additionalMetadata.defenseDamageReduction = damageReduction;
    },
  },
  additionalMetadata: {
    manaSuppressed: false,
    ignoreManaSuppressed: false,
    attackedThisTurn: false,
    accessToDefaultCardOptions: true,
    timedEffectAttackedThisTurn: false,
    defenseDamageReduction: 0,
  },
});
