import Character from "../../character";
import Stats from "../../stats";
import { StatsEnum } from "../../stats";
import { seinDeck } from "../../decks/SeinDeck";
import { CharacterName } from "../metadata/CharacterName";
import { CharacterEmoji } from "../../formatting/emojis";

const SEIN_HEALING_BASE = 3;
const SEIN_HEALING_RAMP = 0.1;

const seinStats = new Stats({
  [StatsEnum.HP]: 100,
  [StatsEnum.ATK]: 10,
  [StatsEnum.DEF]: 10,
  [StatsEnum.SPD]: 9,
  [StatsEnum.Ability]: 0.0,
});

export const Sein = new Character({
  name: CharacterName.Sein,
  cosmetic: {
    pronouns: {
      possessive: "his",
      reflexive: "himself",
    },
    emoji: CharacterEmoji.SEIN,
    color: 0xa3caca,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1346555621952192522/1347898000717910057/Sein_anime_portrait.webp?ex=67dca896&is=67db5716&hm=ce78236ebb64724705c48a5221039f22e546cd1c9f940aa0036003b8bc74e49b&",
  },
  stats: seinStats,
  cards: seinDeck,
  ability: {
    abilityName: "Goddess' Blessing",
    abilityEffectString: `Heal for ${SEIN_HEALING_BASE}HP + ${SEIN_HEALING_BASE} * (Turn Count * ${SEIN_HEALING_RAMP * 100}%) at the end of every turn.
        This character can be healed past their maxHP.`,
    abilityEndOfTurnEffect: (game, characterIndex) => {
      console.log("Sein sought the Goddess' Blessings.");
      const character = game.characters[characterIndex];
      const healing =
        SEIN_HEALING_BASE +
        SEIN_HEALING_BASE * (game.turnCount * SEIN_HEALING_RAMP);
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
