import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "@tcg/characters/metadata/CharacterName";
import { CharacterData } from "@tcg/characters/characterData/characterData";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import edelDeck from "@tcg/decks/EdelDeck";

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
    pronouns: {
      personal: "she",
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.EDEL,
    color: 0xae9292,
    imageUrl:
      "https://static.wikia.nocookie.net/frieren/images/a/ab/Edel_anime_portrait.png/revision/latest?cb=20240119235404",
  },
  stats: edelStats,
  cards: edelDeck,
  ability: {
    abilityName: "Memory Transference Specialist",
    abilityEffectString: `At the start of each turn, see a random card from your opponent's hand, and lower its empowerment by 1

	**Sub-Ability: A Superior Opponent** - While you make Eye Contact with the opponent, all their moves have Priority-1.
	`,
  },
  additionalMetadata: {
    manaSuppressed: false,
    ignoreManaSuppressed: false,
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    defenderDamageScaling: 1,
  },
});

export default Edel;
