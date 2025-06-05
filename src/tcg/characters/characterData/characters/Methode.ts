import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import Pronouns from "@tcg/pronoun";
import { CharacterEmoji } from "@src/tcg/formatting/emojis";
import mediaLinks from "@src/tcg/formatting/mediaLinks";
import methodeDeck from "@src/tcg/decks/MethodeDeck";

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
  },
});

export default Methode;
