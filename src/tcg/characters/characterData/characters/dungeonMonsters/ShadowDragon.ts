import { shadowDragonDeck } from "../../../../decks/monsterDecks/ShadowDragonDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const shadowDragonStats = new Stats({
  [StatsEnum.HP]: 150.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 15.0,
  [StatsEnum.SPD]: 15.0,
  [StatsEnum.Ability]: 0.0,
});

export const ShadowDragon = new CharacterData({
  name: CharacterName.ShadowDragon,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.SHADOW_DRAGON,
    color: 0x46184b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1352725898398400512/1352725899010773022/shadow_dragon.png?ex=67df0faa&is=67ddbe2a&hm=3e73986136ba2352adfda87858dd896a1c8643a9e6a791eba80236d0fe1691b3&",
  },
  stats: shadowDragonStats,
  cards: shadowDragonDeck,
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
