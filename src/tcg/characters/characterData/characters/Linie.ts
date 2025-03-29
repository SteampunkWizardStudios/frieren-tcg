import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { linieDeck } from "../../../decks/LinieDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const LINIE_CHAIN_BONUS = 0.08;

const linieStats = new Stats({
  [StatsEnum.HP]: 95.0,
  [StatsEnum.ATK]: 13.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

export const Linie = new CharacterData({
  name: CharacterName.Linie,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.LINIE,
    color: 0xf7c1b1,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1347897148330606643/Linie_anime_portrait.webp?ex=67dca7ca&is=67db564a&hm=5cf66096e541bb9495c1e5749765f31c013a3644e20e04f7fd0ce9e87dcb8b03&",
  },
  stats: linieStats,
  cards: linieDeck,
  ability: {
    abilityName: "Chain Attack",
    abilityEffectString: `After this character uses an attack, gain 1 Chain stack.
        All attacks this character does has its damage increased by <#Chain>*${LINIE_CHAIN_BONUS * 100}%.
        When this character does not attack in a turn, reset the count to 0.`,
    abilityAttackEffect: (game, characterIndex) => {
      const character = game.getCharacter(characterIndex);
      game.additionalMetadata.attackModifier[characterIndex] =
        1 + character.stats.stats[StatsEnum.Ability] * LINIE_CHAIN_BONUS;
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
    ) => {
      const character = game.getCharacter(characterIndex);
      if (
        character.additionalMetadata.attackedThisTurn ||
        character.additionalMetadata.timedEffectAttackedThisTurn
      ) {
        if (character.stats.stats.Ability === 0) {
          messageCache.push("Linie started her chain", TCGThread.Gameroom);
        } else {
          messageCache.push("Linie continued her chain", TCGThread.Gameroom);
        }
        character.adjustStat(1, StatsEnum.Ability);
      } else {
        if (character.stats.stats.Ability > 0) {
          messageCache.push("Linie ended her chain", TCGThread.Gameroom);
        }
        character.setStat(0, StatsEnum.Ability);
      }
    },
  },
  additionalMetadata: {
    manaSuppressed: false,
    attackedThisTurn: false,
    accessToDefaultCardOptions: true,
    timedEffectAttackedThisTurn: false,
  },
});
