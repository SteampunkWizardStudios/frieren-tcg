import {
  a_catastraviaBase,
  a_concentratedOffensiveMagicZoltraak,
  a_daosdorgBase,
  a_waldgoseBase,
} from "@decks/DenkenDeck";
import {
  a_fernBarrage,
  a_fernZoltraak,
  manaConcealment,
  spellToCreateManaButterflies,
} from "@decks/FernDeck";
import {
  a_judradjim,
  a_vollzanbel,
  a_zoltraak,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  fieldOfFlower,
} from "@decks/FrierenDeck";
import { a_supersonicStrike, a_whip, hide } from "@decks/LaufenDeck";
import {
  a_erfassenAxe,
  a_erfassenKnife,
  a_erfassenSword,
  a_erfassenJavelin,
  adapt,
  manaDetection,
} from "@decks/LinieDeck";
import { a_killingMagic, solitude } from "@decks/monsterDecks/CosmicTonDeck";
import {
  a_trustInYourAllyFernsBarrage,
  a_trustInYourAllyFrierensZoltraak,
  awakening,
  poisonCure,
} from "@decks/SeinDeck";
import {
  a_hairWhip,
  a_pierce,
  a_piercingDrill,
  sharpen,
  rest,
} from "@decks/SenseDeck";
import { a_cleave, a_dismantle, a_reelseiden, sorganeil } from "@decks/UbelDeck";
import { a_malevolentShrine } from "./ubelSignature";

export const serie_offensiveMagic_common = [
  a_zoltraak,
  a_whip,
  a_erfassenSword,
  a_trustInYourAllyFrierensZoltraak,
  a_reelseiden,
  a_fernZoltraak,
  a_erfassenKnife,
];

export const serie_offensiveMagic_rare = [
  a_judradjim,
  a_supersonicStrike,
  a_erfassenJavelin,
  a_erfassenAxe,
  a_pierce,
  a_fernBarrage,
  a_waldgoseBase,
  a_daosdorgBase,
  a_concentratedOffensiveMagicZoltraak,
  a_killingMagic,
  a_cleave,
  a_dismantle,
  a_hairWhip,
  a_trustInYourAllyFernsBarrage,
];

export const serie_offensiveMagic_unusual = [
  a_vollzanbel,
  a_piercingDrill,
  a_catastraviaBase,
  a_malevolentShrine,
];

export const serie_utilityMagic_tactics = [
  sharpen,
  awakening,
  adapt,
  manaDetection,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  manaConcealment,
  sorganeil,
];

export const serie_utilityMagic_recovery = [
  solitude,
  rest,
  poisonCure,
  hide,
  fieldOfFlower,
  spellToCreateManaButterflies,
];
