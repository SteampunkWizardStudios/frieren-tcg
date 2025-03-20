import Character from "../../character";
import { stilleDeck } from "../../decks/StilleDeck";
import { CharacterEmoji } from "../../formatting/emojis";
import Stats from "../../stats";
import { StatsEnum } from "../../stats";
import Rolls from "../../util/rolls";
import { CharacterName } from "../metadata/CharacterName";

const stilleStats = new Stats({
  [StatsEnum.HP]: 20.0,
  [StatsEnum.ATK]: 1.0,
  [StatsEnum.DEF]: 20.0,
  [StatsEnum.SPD]: 99.0,
  [StatsEnum.Ability]: 0.0,
});

export const Stille = new Character({
  name: CharacterName.Stille,
  cosmetic: {
    pronouns: {
      possessive: "its",
      reflexive: "itself",
    },
    emoji: CharacterEmoji.STILLE,
    color: 0xe74c3c,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1347746124936646756/Stille_EP18.webp?ex=67dcc3e4&is=67db7264&hm=2b4045f648e23094cc5011390d138a4e350471c86533dc7ec07a1d4b34c684f2&",
  },
  stats: stilleStats,
  cards: stilleDeck,
  ability: {
    abilityName: "High-speed Escape",
    abilityEffectString: `When the opponent attacks, roll a D100. 
        If the result is less than the character's SPD minus the opponent's SPD, ignore the attack.
        Afterwards, attack the opponent with DMG equivalent to 1/2 * (opponent's ATK + opponent's move DMG).
        This character does not have access to default card options (Discard/Wait).`,
    abilityDefendEffect: (game, characterIndex, attackDamage) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const roll = Rolls.rollD100();
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      console.log(`Roll: ${roll}. SPD diff: ${spdDiff}`);

      if (roll < spdDiff) {
        console.log("Stille evaded the attack!");
        game.additionalMetadata.attackMissed[1 - characterIndex] = true;

        console.log(
          "The Stille's high speed escape reflected the opponent's damage!",
        );
        game.attack({
          attackerIndex: characterIndex,
          damage: (opponent.stats.stats.ATK + attackDamage) / 2,
          isTimedEffectAttack: false,
        });
      } else {
        console.log("Stille failed to evade the attack!");
        game.additionalMetadata.attackMissed[1 - characterIndex] = false;
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    manaSuppressed: false,
  },
});
