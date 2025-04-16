import { CharacterData } from "../characterData";
import { ubelDeck } from "../../../decks/UbelDeck";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import Rolls from "../../../util/rolls";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const ubelStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 8.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

export const Ubel = new CharacterData({
  name: CharacterName.Ubel,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.UBEL,
    color: 0x3C5502,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1147147425878921240/1361843328596840558/Xdt0V0dFkFFUIynaHzeRl4CDSpdXIIyx.png?ex=68003aef&is=67fee96f&hm=272a9e1a94f2bae706b259a9cf6e7b19eb135bab69b8bfff26c343be7744c318&",
  },
  stats: ubelStats,
  cards: ubelDeck,
  ability: {
    abilityName: "Battle-crazed weirdo",
    abilityEffectString: "Übel's attack ignore the opponent's defense stats, but are blocked by defensive moves.",

    abilityStartOfTurnEffect: (
      game,
      characterIndex,
      _messageCache: MessageCache
    ) => {
      const character = game.characters[characterIndex];
      const opponent = game.getCharacter(1 - characterIndex);
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;

      character.setStat(100 - spdDiff, StatsEnum.Ability, false);
      character.additionalMetadata.accessToDefaultCardOptions = false;
      opponent.additionalMetadata.accessToDefaultCardOptions = false;
    },
    abilityDefendEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
      _attackDamage
    ) => {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const roll = Rolls.rollD100();
      const spdDiff = character.stats.stats.SPD - opponent.stats.stats.SPD;
      messageCache.push(`## **SPD diff**: ${spdDiff}`, TCGThread.Gameroom);
      messageCache.push(`# Roll: ${roll}`, TCGThread.Gameroom);

      if (roll < spdDiff) {
        messageCache.push("## Stille evaded the attack!", TCGThread.Gameroom);
        game.additionalMetadata.attackMissed[1 - characterIndex] = true;
      } else {
        messageCache.push(
          "## Stille failed to evade the attack!",
          TCGThread.Gameroom
        );
        game.additionalMetadata.attackMissed[1 - characterIndex] = false;
      }
    },
    abilityCounterEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
      attackDamage
    ) => {
      const opponent = game.getCharacter(1 - characterIndex);

      if (game.additionalMetadata.attackMissed[1 - characterIndex]) {
        messageCache.push(
          "## The Stille's high speed escape reflected the opponent's damage!",
          TCGThread.Gameroom
        );
        game.attack({
          attackerIndex: characterIndex,
          damage: (opponent.stats.stats.ATK + attackDamage) / 2,
          isTimedEffectAttack: false,
        });
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: false,
    manaSuppressed: false,
  },
});
