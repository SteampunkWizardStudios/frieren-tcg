import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import { senseDeck } from "../../../decks/SenseDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "../../../formatting/emojis";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
// import config from "@src/config";

// config module not found for some reason
// const PACIFIST_TURN_COUNT = config.debugMode ? 1 : 15;
const PACIFIST_TURN_COUNT = 15;

const senseStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 12.0,
  [StatsEnum.SPD]: 8.0,
  [StatsEnum.Ability]: 0.0,
});

export const Sense = new CharacterData({
  name: CharacterName.Sense,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.SENSE,
    color: 0xb6a493,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1347401422655983676/Sense_anime_portrait.webp?ex=67dcd45c&is=67db82dc&hm=ce49cf1681d25f349fa302868b4a0839e178f7c6f9153e694637e6162110fb2d&",
  },
  stats: senseStats,
  cards: senseDeck,
  ability: {
    abilityName: "Pacifist",
    abilityEffectString: `When this character has 2 Tea Time Snacks, skip the turn for both characters.
        This character wins if they don't attack for ${PACIFIST_TURN_COUNT} turns in a row.`,
    abilityAfterOwnCardUse: function (
      game,
      characterIndex,
      messageCache: MessageCache,
      card
    ) {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);
      if ("TeaTime" in card.tags) {
        character.additionalMetadata.teaTimeStacks! += card.tags["TeaTime"];
        if (character.additionalMetadata.teaTimeStacks! >= 2) {
          messageCache.push(
            "Sense holds a tea party! Both characters take a turn to enjoy the tea.",
            TCGThread.Gameroom
          );
          character.additionalMetadata.teaTimeStacks! -= 2;
          character.skipTurn = true;
          opponent.skipTurn = true;
        }
      }
    },
    abilityEndOfTurnEffect: (
      game,
      characterIndex,
      messageCache: MessageCache
    ) => {
      const character = game.characters[characterIndex];
      if (character.additionalMetadata.attackedThisTurn) {
        messageCache.push("Sense is no longer a Pacifist!", TCGThread.Gameroom);
        character.setStat(0, StatsEnum.Ability);
      } else {
        messageCache.push("Sense is a Pacifist!", TCGThread.Gameroom);
        character.adjustStat(1, StatsEnum.Ability);

        if (character.stats.stats.Ability === PACIFIST_TURN_COUNT) {
          messageCache.push("# Sense stayed a Pacifist!", TCGThread.Gameroom);
          game.additionalMetadata.forfeited[1 - characterIndex] = true;
        }
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    teaTimeStacks: 0,
    defenseDamageReduction: 0,
  },
});
