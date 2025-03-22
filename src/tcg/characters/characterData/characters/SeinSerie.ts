import { CharacterData } from "../characterData";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import {
  a_threeSpearsOfTheGoddess,
  a_trustInYourAllyFernsBarrage,
  braceYourself,
  mugOfBeer,
  poisonCure,
  seinDeck,
  smokeBreak,
} from "../../../decks/SeinDeck";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";
import { getStats } from "./statsUtil/getStats";
import {
  a_livingGrimoire,
  a_livingGrimoire1,
  ancientBarrierMagic,
  basicDefensiveMagic,
  mock,
} from "../../../decks/SerieDeck";
import { fieldOfFlower } from "../../../decks/FrierenDeck";

const SEIN_BASE_HEALING = 3;
const SEIN_HEALING_RAMP = 0.1;
const SERIE_WARMONGER_DAMAGE_BONUS = 0.5;

const seinSerieDeck = [
  { card: a_livingGrimoire, count: 2 },
  { card: a_livingGrimoire1, count: 2 },
  { card: a_trustInYourAllyFernsBarrage, count: 2 },
  { card: a_threeSpearsOfTheGoddess, count: 2 },
  { card: poisonCure, count: 1 },
  { card: fieldOfFlower, count: 1 },
  { card: basicDefensiveMagic, count: 1 },
  { card: ancientBarrierMagic, count: 1 },
  { card: mock, count: 1 },
  { card: smokeBreak, count: 1 },
  { card: mugOfBeer, count: 1 },
];

export const createSeinSerie = () =>
  new CharacterData({
    name: CharacterName.SeinSerie,
    cosmetic: {
      pronouns: {
        possessive: "their",
        reflexive: "themselves",
      },
      emoji: CharacterEmoji.SEIN_SERIE,
      color: 0xc5c3cc,
      imageUrl:
        "https://cdn.discordapp.com/attachments/1348668478709698621/1351033077773893653/ilovegambling.png?ex=67ded5da&is=67dd845a&hm=85d91cd04eec12a77e90d59aa8d52c76fe31697c7ccfb8fd06ea352d86b5b6c0&",
    },
    get stats() {
      const characterStats: any = getStats();
      return new Stats(
        {
          [StatsEnum.HP]:
            characterStats.Sein.maxHp + characterStats.Serie.maxHp,
          [StatsEnum.ATK]: characterStats.Sein.atk + characterStats.Serie.atk,
          [StatsEnum.DEF]: characterStats.Sein.def + characterStats.Serie.def,
          [StatsEnum.SPD]: characterStats.Sein.spd + characterStats.Sein.spd,
          [StatsEnum.Ability]: 0.0,
        },
        characterStats.Sein.currHp + characterStats.Serie.currHp,
      );
    },
    cards: seinSerieDeck,
    ability: {
      abilityName: "Warmonger's Blessing",
      abilityEffectString: `Heal for ${SEIN_BASE_HEALING}HP + ${SEIN_BASE_HEALING} * (Turn Count * ${(SEIN_HEALING_RAMP * 100).toFixed(2)}%) at the end of every turn.
        This character can be healed past their maxHP.
        This character's attack is also increased by ${(SERIE_WARMONGER_DAMAGE_BONUS * 100).toFixed(2)}%`,
      abilityAttackEffect(game, characterIndex, _messageCache) {
        game.additionalMetadata.attackModifier[characterIndex] =
          1 + SERIE_WARMONGER_DAMAGE_BONUS;
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
