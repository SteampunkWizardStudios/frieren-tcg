import { MessageCache } from "../../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../../tcgChatInteractions/sendGameMessage";
import { cosmicTonDeck } from "../../../../decks/monsterDecks/CosmicTonDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import Rolls from "../../../../util/rolls";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const COSMIC_TON_BASE_EVASION = 3;
const COSMIC_TON_MAX_EVASION_TURNS = 11;
const COSMIC_TON_MAX_EVASION =
  COSMIC_TON_BASE_EVASION * COSMIC_TON_MAX_EVASION_TURNS;

const cosmicTonStats = new Stats({
  [StatsEnum.HP]: 200.0,
  [StatsEnum.ATK]: 40.0,
  [StatsEnum.DEF]: 20.0,
  [StatsEnum.SPD]: 20.0,
  [StatsEnum.Ability]: COSMIC_TON_BASE_EVASION,
});

export const CosmicTon = new CharacterData({
  name: CharacterName.CosmicTon,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.COSMIC_TON,
    color: 0x3b0839,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1352656084577554472/1352735597525209219/cs.ton_take2.png?ex=67df18b3&is=67ddc733&hm=5faeb7e01fd439cb316a018e35815dce08f054ca88e48f17b7264db38d3f64de&",
  },
  stats: cosmicTonStats,
  cards: cosmicTonDeck,
  ability: {
    abilityName: "The Space grows Dim",
    abilityEffectString: `This character has a ${COSMIC_TON_BASE_EVASION}% chance to dodge any attack. This number increases by ${COSMIC_TON_BASE_EVASION}% every turn, and caps at ${COSMIC_TON_MAX_EVASION}%.`,
    abilityDefendEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
      _attackDamage,
    ) => {
      const character = game.getCharacter(characterIndex);

      const roll = Rolls.rollD100();
      const evChance = character.stats.stats.Ability;
      messageCache.push(
        `## **Evasion Chance**: ${evChance}`,
        TCGThread.Gameroom,
      );
      messageCache.push(`# Roll: ${roll}`, TCGThread.Gameroom);

      if (roll < evChance) {
        messageCache.push(
          "You swung blindly in the dark. Your attack missed.",
          TCGThread.Gameroom,
        );
        game.additionalMetadata.attackMissed[1 - characterIndex] = true;
      } else {
        messageCache.push("You hit him head on!", TCGThread.Gameroom);
        game.additionalMetadata.attackMissed[1 - characterIndex] = false;
      }
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
    ) => {
      const character = game.characters[characterIndex];

      if (character.stats.stats.Ability < COSMIC_TON_MAX_EVASION) {
        messageCache.push("The space grows dim.", TCGThread.Gameroom);
        character.adjustStat(COSMIC_TON_BASE_EVASION, StatsEnum.Ability);
      } else {
        messageCache.push(
          "The space cannot grow any darker.",
          TCGThread.Gameroom,
        );
      }
    },
  },
  additionalMetadata: {
    manaSuppressed: true,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
  },
});
