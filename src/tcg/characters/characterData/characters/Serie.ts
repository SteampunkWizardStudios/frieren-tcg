import { CharacterData } from "../characterData";
import { serieDeck } from "../../../decks/SerieDeck";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "../../../formatting/emojis";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { getStats } from "./statsUtil/getStats";

const SERIE_WARMONGER_DAMAGE_BONUS = 0.5;

const serieStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 14.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

export const createSerie = () =>
  new CharacterData({
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
    get stats() {
      const characterStats: any = getStats();
      return new Stats(
        {
          [StatsEnum.HP]: characterStats.Serie.maxHp,
          [StatsEnum.ATK]: characterStats.Serie.atk,
          [StatsEnum.DEF]: characterStats.Serie.def,
          [StatsEnum.SPD]: characterStats.Serie.spd,
          [StatsEnum.Ability]: 0.0,
        },
        characterStats.Serie.currHp,
      );
    },
    cards: serieDeck,
    ability: {
      abilityName: "Warmonger",
      abilityEffectString: `Any attack used by this character has its DMG+${(SERIE_WARMONGER_DAMAGE_BONUS * 100).toFixed(2)}%. After this character attacks directly, skip a turn.`,
      abilityAttackEffect(game, characterIndex, _messageCache) {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 + SERIE_WARMONGER_DAMAGE_BONUS;
      },
      abilityAfterDirectAttackEffect(
        game,
        characterIndex,
        messageCache: MessageCache,
      ) {
        messageCache.push("Serie lazes about", TCGThread.Gameroom);
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
