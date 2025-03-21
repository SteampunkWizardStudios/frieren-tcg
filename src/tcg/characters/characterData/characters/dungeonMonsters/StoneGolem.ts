import { stoneGeiselDeck } from "../../../../decks/monsterDecks/StoneGeiselDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const stoneGolemStats = new Stats({
  [StatsEnum.HP]: 60.0,
  [StatsEnum.ATK]: 20.0,
  [StatsEnum.DEF]: 15.0,
  [StatsEnum.SPD]: 3.0,
  [StatsEnum.Ability]: 0.0,
});

export const StoneGolem = new CharacterData({
  name: CharacterName.StoneGolem,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.STONE_GOLEM,
    color: 0x98999b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695596452446358/1352383230376022138/image.png?ex=67de7948&is=67dd27c8&hm=1ba6cc5d8dd7bfe46509d535651d69063f0fce3afd910434e5932f96b968d3bd&",
  },
  stats: stoneGolemStats,
  cards: stoneGeiselDeck,
  ability: {
    abilityName: "Monster",
    abilityEffectString: `This character does not have access to default card options (Discard/Wait).`,
  },
  additionalMetadata: {
    manaSuppressed: false,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
  },
});
