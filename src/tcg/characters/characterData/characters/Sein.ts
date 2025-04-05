import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { seinDeck } from "../../../decks/SeinDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const SEIN_BASE_HEALING = 3;
const SEIN_HEALING_RAMP = 0.1;

const imageUrl: Record<string, string> = {
  icon: "https://cdn.discordapp.com/attachments/1346555621952192522/1347898000717910057/Sein_anime_portrait.webp?ex=67dca896&is=67db5716&hm=ce78236ebb64724705c48a5221039f22e546cd1c9f940aa0036003b8bc74e49b&",
  vangerisuCardVer:
    "https://cdn.discordapp.com/attachments/1351391350398128159/1353035306840096848/Sein_Card.png?ex=67e02fd3&is=67dede53&hm=53829f9cd04a268eb8b6f9dba932220e814be02c9c6f6e76f61ab83e6c20c24d&",
};

const seinStats = new Stats({
  [StatsEnum.HP]: 100.0,
  [StatsEnum.ATK]: 11.0,
  [StatsEnum.DEF]: 11.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

export const Sein = new CharacterData({
  name: CharacterName.Sein,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.SEIN,
    color: 0xa3caca,
    imageUrl: imageUrl.vangerisuCardVer,
  },
  stats: seinStats,
  cards: seinDeck,
  ability: {
    abilityName: "Goddess' Blessing",
    abilityEffectString: `Heal for ${SEIN_BASE_HEALING}HP + ${SEIN_BASE_HEALING} * (Turn Count * ${(SEIN_HEALING_RAMP * 100).toFixed(2)}%) at the end of every turn.
        This character can be healed past their maxHP.`,
    abilityStartOfTurnEffect: function (
      this,
      game,
      characterIndex,
      _messageCache,
    ) {
      const character = game.characters[characterIndex];
      const healing =
        SEIN_BASE_HEALING +
        SEIN_BASE_HEALING * (game.turnCount * SEIN_HEALING_RAMP);

      character.setStat(healing, StatsEnum.Ability, false);
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache,
    ) => {
      messageCache.push(
        "Sein sought the Goddess' Blessings.",
        TCGThread.Gameroom,
      );
      const character = game.characters[characterIndex];
      character.adjustStat(character.stats.stats.Ability, StatsEnum.HP);
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    overheal: true,
  },
});
