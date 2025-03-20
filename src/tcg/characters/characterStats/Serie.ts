import Character from "../../character";
import { serieDeck } from "../../decks/SerieDeck";
import { CharacterEmoji } from "../../formatting/emojis";
import Stats from "../../stats";
import { StatsEnum } from "../../stats";
import { CharacterName } from "../metadata/CharacterName";

const SERIE_WARMONGER_DAMAGE_BONUS = 1.3;

const serieStats = new Stats({
  [StatsEnum.HP]: 100,
  [StatsEnum.ATK]: 14,
  [StatsEnum.DEF]: 10,
  [StatsEnum.SPD]: 14,
  [StatsEnum.Ability]: 0.0,
});

export const Serie = new Character({
  name: CharacterName.Serie,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.SERIE,
    color: 0xe8b961,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1347746220025577511/Serie_anime_portrait.webp?ex=67dcc3fa&is=67db727a&hm=7207f7eb67d49a3ce4bcf6cd0e06128d4e4fe21d53a5c4d47f532162d247dd3f&",
  },
  stats: serieStats,
  cards: serieDeck,
  ability: {
    abilityName: "Warmonger",
    abilityEffectString: `Any attack used by this character has its DMG+${((SERIE_WARMONGER_DAMAGE_BONUS - 1) * 100).toFixed(2)}%.
        After the character uses any attack, skip next turn.`,
    abilityAttackEffect(game, characterIndex) {
      game.additionalMetadata.attackModifier[characterIndex] =
        SERIE_WARMONGER_DAMAGE_BONUS;
    },
    abilityAfterDirectAttackEffect(game, characterIndex) {
      console.log("Serie lazes about");
      const character = game.getCharacter(characterIndex);
      character.skipTurn = true;
    },
  },
  additionalMetadata: {
    manaSuppressed: true,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
  },
});
