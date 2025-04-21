import {
  a_catastraviaBase,
  a_concentratedOffensiveMagicZoltraak,
  a_daosdorgBase,
  a_waldgoseBase,
} from "../DenkenDeck";
import {
  a_judradjim,
  a_vollzanbel,
  a_zoltraak,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  fieldOfFlower,
} from "../FrierenDeck";
import { a_supersonicStrike, a_whip, hide } from "../LaufenDeck";
import {
  a_erfassenAxe,
  a_erfassenKnife,
  a_erfassenSword,
  a_erfassenJavelin,
  adapt,
  manaDetection,
} from "../LinieDeck";
import { a_killingMagic, solitude } from "../monsterDecks/CosmicTonDeck";
import {
  a_threeSpearsOfTheGoddess,
  a_trustInYourAllyFernsBarrage,
  a_trustInYourAllyFrierensZoltraak,
  awakening,
  poisonCure,
} from "../SeinDeck";
import {
  a_hairWhip,
  a_pierce,
  a_piercingDrill,
  harden,
  rest,
} from "../SenseDeck";

export const serie_offensiveMagic = [
  a_zoltraak,
  a_judradjim,
  a_vollzanbel,
  a_whip,
  a_supersonicStrike,
  a_erfassenAxe,
  a_erfassenKnife,
  a_erfassenSword,
  a_erfassenJavelin,
  a_trustInYourAllyFernsBarrage,
  a_trustInYourAllyFrierensZoltraak,
  // a_threeSpearsOfTheGoddess,
  a_hairWhip,
  a_pierce,
  a_piercingDrill,
  a_waldgoseBase,
  a_daosdorgBase,
  a_concentratedOffensiveMagicZoltraak,
  a_catastraviaBase,

  a_killingMagic,
];

export const serie_utilityMagic = [
  solitude,
  harden,
  rest,
  awakening,
  poisonCure,
  adapt,
  manaDetection,
  hide,
  barrierMagicAnalysis,
  demonMagicAnalysis,
  fieldOfFlower,
];
