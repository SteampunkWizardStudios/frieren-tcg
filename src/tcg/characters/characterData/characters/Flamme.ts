import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import flammeDeck from "@src/tcg/decks/FlammeDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const flammeStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

const Flamme = new CharacterData({
  name: CharacterName.Flamme,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.FLAMME,
    color: 0xde8a54,
    imageUrl: mediaLinks.flammePortrait,
  },
  stats: flammeStats,
  cards: flammeDeck,
  ability: {
    abilityName: "Founder of Humanity's Magic",
    abilityEffectString: `After playing 4 Theory cards, add 1 "Pinnacle of Humanity's Magic" to your Discard pile. *Pinnacle of Humanity's Magic*: ATK+**100** DEF+**100** SPD+**100**. Deal **100** DMG.`,
    subAbilities: [
      {
        name: "Deceitful",
        description:
          "This character's stat is always displayed as 10/1/1/1. This character can also see past the opponent's Mana Suppression.",
      },
    ],
  },
  additionalMetadata: {
    deceitful: true,
    ignoreManaSuppressed: true,
    defenderDamageScaling: 1,
  },
});

export default Flamme;
