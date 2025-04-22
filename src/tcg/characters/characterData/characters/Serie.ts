import { CharacterData } from "../characterData";
import { serieDeck } from "../../../decks/SerieDeck";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "../../../formatting/emojis";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import Game from "@src/tcg/game";

const SERIE_TOYING_DAMAGE_BONUS = 0.3;

const imageUrl: Record<string, string> = {
  icon: "https://cdn.discordapp.com/attachments/1346555621952192522/1347746220025577511/Serie_anime_portrait.webp?ex=67dcc3fa&is=67db727a&hm=7207f7eb67d49a3ce4bcf6cd0e06128d4e4fe21d53a5c4d47f532162d247dd3f&",
  vangerisuCardVer:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1352873013695086602/Serie_Card.png?ex=67df98ad&is=67de472d&hm=fb33f3e38ac8fe90be812b86b7f85ab8a9e95f0303eed56c18f362f6a981fe4c&",
};

const serieStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 14.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

const afterAttackEffect = function (
  game: Game,
  characterIndex: number,
  _messageCache: MessageCache
) {
  const character = game.getCharacter(characterIndex);
  if (!character.additionalMetadata.serieToyingTurn) {
    character.additionalMetadata.serieToyingNextTurn = true;
  }
};

export const Serie = new CharacterData({
  name: CharacterName.Serie,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.SERIE,
    color: 0xe8b961,
    imageUrl: imageUrl.vangerisuCardVer,
  },
  stats: serieStats,
  cards: serieDeck,
  ability: {
    abilityName: "Toying Around",
    abilityEffectString: `Any attack used by this character has its DMG+${(SERIE_TOYING_DAMAGE_BONUS * 100).toFixed(2)}%. 
      The turn after this character performs any attack, DMG-${(SERIE_TOYING_DAMAGE_BONUS * 100).toFixed(2)}%.
      
      **Sub-Ability: Mana Suppression** - Hide the amount of HP this character has.
      **Sub-Ability: Keen Eye** - See past the opponent's Mana Suppression.`,
    abilityStartOfTurnEffect(game, characterIndex, messageCache) {
      const character = game.getCharacter(characterIndex);
      if (character.additionalMetadata.serieToyingNextTurn) {
        messageCache.push("## Serie acts aloof.", TCGThread.Gameroom);
        character.additionalMetadata.serieToyingTurn = true;
        character.additionalMetadata.serieToyingNextTurn = false;
        character.setStat(
          1 - SERIE_TOYING_DAMAGE_BONUS,
          StatsEnum.Ability,
          false
        );
      } else {
        character.additionalMetadata.serieToyingTurn = false;
        character.setStat(
          1 + SERIE_TOYING_DAMAGE_BONUS,
          StatsEnum.Ability,
          false
        );
      }
    },
    abilityAttackEffect(game, characterIndex, _messageCache) {
      const character = game.getCharacter(characterIndex);
      if (character.additionalMetadata.serieToyingTurn) {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 - SERIE_TOYING_DAMAGE_BONUS;
      } else {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 + SERIE_TOYING_DAMAGE_BONUS;
      }
    },
    abilityAfterDirectAttackEffect: afterAttackEffect,
    abilityAfterTimedAttackEffect: afterAttackEffect,
  },
  additionalMetadata: {
    manaSuppressed: true,
    ignoreManaSuppressed: true,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    defenseDamageReduction: 0,
    serieToyingNextTurn: false,
    serieToyingTurn: false,
  },
});
