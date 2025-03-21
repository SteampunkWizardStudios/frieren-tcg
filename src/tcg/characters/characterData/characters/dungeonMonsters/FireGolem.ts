import { fireGolemDeck } from "../../../../decks/monsterDecks/FireGolemDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const fireGolemStats = new Stats({
  [StatsEnum.HP]: 40.0,
  [StatsEnum.ATK]: 25.0,
  [StatsEnum.DEF]: 5.0,
  [StatsEnum.SPD]: 12.0,
  [StatsEnum.Ability]: 0.0,
});

export const FireGolem = new CharacterData({
  name: CharacterName.FireGolem,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.FIRE_GOLEM,
    color: 0x951f07,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695646654205972/1352383148390092880/image.png?ex=67de7934&is=67dd27b4&hm=ff76a90615e67b6eceedfcda90fd287f0fafb1ddc931b12cc727e524a2b30fcd&",
  },
  stats: fireGolemStats,
  cards: fireGolemDeck,
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
