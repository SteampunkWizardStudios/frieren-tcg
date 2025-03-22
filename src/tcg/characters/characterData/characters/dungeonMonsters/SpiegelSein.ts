import { MessageCache } from "../../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../../tcgChatInteractions/sendGameMessage";
import { seinDeck } from "../../../../decks/SeinDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const SEIN_BASE_HEALING = 3;
const SEIN_HEALING_RAMP = 0.1;

const spiegelSeinStats = new Stats({
  [StatsEnum.HP]: 110.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 11.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

export const SpiegelSein = new CharacterData({
  name: CharacterName.SpiegelSein,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.SPIEGEL_SEIN,
    color: 0x98999b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695761800302633/1352383326123458651/image.png?ex=67de795f&is=67dd27df&hm=af468960d2ff443a7ad0ace4c6cf4451c945720084c6235bd59cf3f518d8dc2e&",
  },
  stats: spiegelSeinStats,
  cards: seinDeck,
  ability: {
    abilityName: "Goddess' Blessing",
    abilityEffectString: `Heal for ${SEIN_BASE_HEALING}HP + ${SEIN_BASE_HEALING} * (Turn Count * ${(SEIN_HEALING_RAMP * 100).toFixed(2)}%) at the end of every turn.
      This character can be healed past their maxHP.`,
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
    ) => {
      messageCache.push(
        "Sein...? sought the Goddess' Blessings.",
        TCGThread.Gameroom,
      );
      const character = game.characters[characterIndex];
      const healing =
        SEIN_BASE_HEALING +
        SEIN_BASE_HEALING * (game.turnCount * SEIN_HEALING_RAMP);
      character.adjustStat(healing, StatsEnum.HP);
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    manaSuppressed: false,
    overheal: true,
  },
});
