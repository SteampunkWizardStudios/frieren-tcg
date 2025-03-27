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
  a_livingGrimoireOffensive,
  a_livingGrimoireOffensive1,
  ancientBarrierMagic,
  basicDefensiveMagic,
  mock,
} from "../../../decks/SerieDeck";
import { fieldOfFlower } from "../../../decks/FrierenDeck";
import Rolls from "../../../util/rolls";

const GAMBLER_DAMAGE_BONUS = 0.5;

const seinSerieDeck = [
  { card: a_livingGrimoireOffensive, count: 2 },
  { card: a_livingGrimoireOffensive1, count: 2 },
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
        "https://cdn.discordapp.com/attachments/1348668478709698621/1353432381020967095/seriesein.png?ex=67e1a1a1&is=67e05021&hm=86fdf67e8d338417403df66251c676c17edd22ea17221188f7b312b4f40b74e8&",
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
      abilityName: "Gambler",
      abilityEffectString: `Roll a D100 for any attack.
        If the result is >= 76, the attack deals +${(GAMBLER_DAMAGE_BONUS * 100).toFixed(2)}% damage.
        If the result is <= 24, the attack deals -${(GAMBLER_DAMAGE_BONUS * 100).toFixed(2)}% damage.`,
      abilityAttackEffect(game, characterIndex, messageCache) {
        const roll = Rolls.rollD100();
        messageCache.push(`# Gambler Roll: ${roll}`, TCGThread.Gameroom);
        if (roll >= 76) {
          messageCache.push(`## A critical hit!`, TCGThread.Gameroom);
          game.additionalMetadata.attackModifier[characterIndex] =
            1 + GAMBLER_DAMAGE_BONUS;
        } else if (roll <= 24) {
          messageCache.push(`## The gambit failed!`, TCGThread.Gameroom);
          game.additionalMetadata.attackModifier[characterIndex] =
            1 - GAMBLER_DAMAGE_BONUS;
        } else {
          messageCache.push(`## A regular hit!`, TCGThread.Gameroom);
        }
      },
    },
    additionalMetadata: {
      attackedThisTurn: false,
      timedEffectAttackedThisTurn: false,
      manaSuppressed: false,
      overheal: true,
    },
  });
