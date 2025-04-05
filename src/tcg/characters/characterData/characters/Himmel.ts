import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { seinDeck } from "../../../decks/SeinDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const HIMMEL_HERO_PARTY_DAMAGE_BONUS = 0.2;

const imageUrl: Record<string, string> = {
  icon: "https://static.wikia.nocookie.net/frieren/images/9/96/Himmel_anime_portrait.png/revision/latest?cb=20231017083515",
};

const himmelStats = new Stats({
  [StatsEnum.HP]: 80.0,
  [StatsEnum.ATK]: 8.0,
  [StatsEnum.DEF]: 8.0,
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
  cards: seinDeck,
  ability: {
    abilityName: "The Hero Party",
    abilityEffectString: `For each one of Frieren/Heiter/Eisen is active as a timed effect,
        all of this character's attacks and timed effect attacks deal an additional ${(HIMMEL_HERO_PARTY_DAMAGE_BONUS * 100).toFixed(2)}% damage.`,
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    overheal: true,
  },
});
