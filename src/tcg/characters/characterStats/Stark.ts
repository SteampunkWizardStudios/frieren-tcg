import Character from "../../character";
import Stats from "../../stats";
import { StatsEnum } from "../../stats";
import { starkDeck } from "../../decks/StarkDeck";
import { CharacterName } from "../metadata/CharacterName";
import { CharacterEmoji } from "../../formatting/emojis";

const starkStats = new Stats({
  [StatsEnum.HP]: 120.0,
  [StatsEnum.ATK]: 14.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.SPD]: 8.0,
  [StatsEnum.Ability]: 0.0,
});

export const Stark = new Character({
  name: CharacterName.Stark,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.STARK,
    color: 0xb30c0c,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1346693056841388042/Stark_anime_portrait.webp?ex=67dce3a5&is=67db9225&hm=3098cd00290ea8e0d5fe1ce948f16bc4d93890d85ac5bd3e2d27e4397809af3a&",
  },
  stats: starkStats,
  cards: starkDeck,
  ability: {
    abilityName: "Bravest Coward",
    abilityEffectString: `Using attacks without (Resolve) reduces its DMG by 20%.
        Using attacks with (Resolve) increases its DMG by 20%.`,
    abilityOnCardUse: function (game, characterIndex, card) {
      const character = game.getCharacter(characterIndex);
      if ("Resolve" in card.tags) {
        character.adjustStat(card.tags["Resolve"], StatsEnum.Ability);
      }
    },
    abilityAttackEffect: function (game, characterIndex) {
      const character = game.getCharacter(characterIndex);
      if (character.stats.stats.Ability > 0) {
        game.additionalMetadata.attackModifier[characterIndex] = 1.2;
        character.adjustStat(-1, StatsEnum.Ability);
      } else {
        game.additionalMetadata.attackModifier[characterIndex] = 0.8;
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    manaSuppressed: false,
  },
});
