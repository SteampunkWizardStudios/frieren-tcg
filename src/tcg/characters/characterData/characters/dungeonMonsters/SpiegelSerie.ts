import { MessageCache } from "../../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../../tcgChatInteractions/sendGameMessage";
import { serieDeck } from "../../../../decks/SerieDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const SERIE_WARMONGER_DAMAGE_BONUS = 1.0;

const spiegelSerieStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 14.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

export const SpiegelSerie = new CharacterData({
  name: CharacterName.SpiegelSerie,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.SPIEGEL_SERIE,
    color: 0x98999b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695818083795056/1351936396125802659/sp.serie.png?ex=67de2aa2&is=67dcd922&hm=44e2c298a8815e4cb225431f5450cb3f493f3bf8647d11967c09968b1f593a25&",
  },
  stats: spiegelSerieStats,
  cards: serieDeck,
  ability: {
    abilityName: "Warmonger",
    abilityEffectString: `Any attack used by this character has its DMG+${(SERIE_WARMONGER_DAMAGE_BONUS * 100).toFixed(2)}%. After this character attacks directly, skip a turn.`,
    abilityAttackEffect(game, characterIndex, _messageCache) {
      game.additionalMetadata.attackModifier[characterIndex] = 1.5;
    },
    abilityAfterDirectAttackEffect(
      game,
      characterIndex,
      messageCache: MessageCache,
    ) {
      messageCache.push("Serie...? lazes about", TCGThread.Gameroom);
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
