import { angryMimicDeck } from "../../../../decks/monsterDecks/AngryMimicDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const angryMimicStats = new Stats({
  [StatsEnum.HP]: 80.0,
  [StatsEnum.ATK]: 4.0,
  [StatsEnum.DEF]: 4.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

export const AngryMimic = new CharacterData({
  name: CharacterName.AngryMimic,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.ANGRY_MIMIC,
    color: 0x994a44,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695922140283012/1352306976217895005/image.png?ex=67dedb03&is=67dd8983&hm=e12d5eeb74a94bdc55cad5477d4bff1c20c2aeaa4f30c684ba7bf0abfb996fa0&",
  },
  stats: angryMimicStats,
  cards: angryMimicDeck,
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
