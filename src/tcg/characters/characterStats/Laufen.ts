import Character from "../../character";
import Stats from "../../stats";
import { StatsEnum } from "../../stats";
import { laufenDeck } from "../../decks/LaufenDeck";
import Rolls from "../../util/rolls";
import { CharacterName } from "../metadata/CharacterName";
import { CharacterEmoji } from "../../formatting/emojis";

const laufenStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 6.0,
  [StatsEnum.SPD]: 25.0,
  [StatsEnum.Ability]: 0.0,
});

export const Laufen = new Character({
  name: CharacterName.Laufen,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.LAUFEN,
    color: 0xcf7457,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1346694607467184179/Laufen_anime_portrait.webp?ex=67dce516&is=67db9396&hm=c8439cdb36a948bfa707b18d46177518aac79300021391b77791d2ba30985947&",
  },
  stats: laufenStats,
  cards: laufenDeck,
  ability: {
    abilityName: "Evasive",
    abilityEffectString: `When the opponent attacks, roll a D100.
        If the result is less than the character's speed minus the opponent's speed, the attack deals 0 damage.`,
    abilityDefendEffect: (game, characterIndex, _attackDamage) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const roll = Rolls.rollD100();
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      console.log(`Roll: ${roll}. SPD diff: ${spdDiff}`);

      if (roll < spdDiff) {
        console.log("Laufen evaded the attack!");
        game.additionalMetadata.attackMissed[1 - characterIndex] = true;
      } else {
        console.log("Laufen failed to evade the attack!");
        game.additionalMetadata.attackMissed[1 - characterIndex] = false;
      }
    },
  },
  additionalMetadata: {
    manaSuppressed: false,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
  },
});
