import { MessageCache } from "../../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../../tcgChatInteractions/sendGameMessage";
import { senseDeck } from "../../../../decks/SenseDeck";
import { CharacterEmoji } from "../../../../formatting/emojis";
import Stats, { StatsEnum } from "../../../../stats";
import { CharacterName } from "../../../metadata/CharacterName";
import { CharacterData } from "../../characterData";

const PACIFIST_TURN_COUNT = 15;

const senseStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 14.0,
  [StatsEnum.SPD]: 8.0,
  [StatsEnum.Ability]: 0.0,
});

export const SpiegelSense = new CharacterData({
  name: CharacterName.SpiegelSense,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.SPIEGEL_SENSE,
    color: 0x98999b,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1351695876917170307/1351937036453679195/sp.sense.png?ex=67de2b3b&is=67dcd9bb&hm=02a9c8c1492d2c2a239cd481e2644023b668421fed6da540586962e975514c71&",
  },
  stats: senseStats,
  cards: senseDeck,
  ability: {
    abilityName: "Pacifist",
    abilityEffectString: `When this character has 2 Tea Time Snacks, skip the turn for both characters.
        This character wins if they don't attack for ${PACIFIST_TURN_COUNT} turns in a row.`,
    abilityOnCardUse: function (
      game,
      characterIndex,
      messageCache: MessageCache,
      card,
    ) {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);
      if ("TeaTime" in card.tags) {
        character.additionalMetadata.teaTimeStacks! += card.tags["TeaTime"];
        if (character.additionalMetadata.teaTimeStacks! >= 2) {
          messageCache.push(
            "Sense holds a tea party! Both characters take a turn to enjoy the tea.",
            TCGThread.Gameroom,
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
      messageCache: MessageCache,
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
          game.gameOver = true;
        }
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    manaSuppressed: false,
    teaTimeStacks: 0,
  },
});
