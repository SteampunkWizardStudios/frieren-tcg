import { stoneGeiselDeck } from "../../../../decks/monsterDecks/StoneGeiselDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const stoneGeiselStats = new Stats({
  [StatsEnum.HP]: 50.0,
  [StatsEnum.ATK]: 15.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 5.0,
  [StatsEnum.Ability]: 0.0,
});

export const StoneGeisel = new CharacterData({
  name: CharacterName.StoneGeisel,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.STONE_GEISEL,
    color: 0x98999b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351703769611636768/1351935671299866634/stone_speigel.png?ex=67de29f5&is=67dcd875&hm=db650f4bc5a39e087c3cb838cf8b0543eddbc328a6d2ec2a36832fc3219bcce0&",
  },
  stats: stoneGeiselStats,
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
