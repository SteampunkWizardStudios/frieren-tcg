import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import edelDeck from "@tcg/decks/EdelDeck";
import Pronouns from "@src/tcg/pronoun";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import mediaLinks from "@src/tcg/formatting/mediaLinks";

const edelStats = new Stats({
  [StatsEnum.HP]: 70,
  [StatsEnum.ATK]: 7,
  [StatsEnum.DEF]: 7,
  [StatsEnum.SPD]: 10,
  [StatsEnum.Ability]: 0,
});

const Edel = new CharacterData({
  name: CharacterName.Edel,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.EDEL,
    color: 0xae9292,
    imageUrl: mediaLinks.edelPortrait,
  },
  stats: edelStats,
  cards: edelDeck,
  ability: {
    abilityName: "Memory Transference Specialist",
    abilityEffectString: `At the start of each turn, see a random card from your opponent's hand, and lower its empowerment by 1

    **Sub-Ability: A Superior Opponent** - While you make Eye Contact with the opponent, all your moves have Priority+1.
    `,
    abilityStartOfTurnEffect: (game, characterIndex, messageCache) => {
      console.log("Edel ability start of turn effect");
      const self = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);

      const randomCard =
        opponent.hand[Math.floor(Math.random() * opponent.hand.length)];

      const selfThread =
        characterIndex === 0
          ? TCGThread.ChallengerThread
          : TCGThread.OpponentThread;

      messageCache.push(
        `${self.name} pictured a card from ${opponent.name}'s hand.`,
        selfThread
      );
      messageCache.push(`${randomCard.printCard()}`, selfThread);

      // Sub-Ability: A Superior Opponent
      if (self.stats.stats.Ability > 0) {
        self.stats.stats.Ability--;

        self.ability.abilitySelectedMoveModifierEffect = (
          _game,
          _characterIndex,
          _messageCache,
          card,
        ) => {
          card.priority += 1;
        }
      } else {
        self.ability.abilitySelectedMoveModifierEffect = undefined;
      }
    },
  },
});

export default Edel;
