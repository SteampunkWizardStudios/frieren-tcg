import { CharacterName } from "../../characters/metadata/CharacterName";
import Card from "../../card"

import {
    a_catastraviaBase
} from "../DenkenDeck";

import {
    a_vollzanbel
} from "../FrierenDeck";

import {
    a_realHeroSwing
} from "../HimmelDeck";

import {
    a_supersonicStrike
} from "../LaufenDeck";

import {
    a_erfassenAxe
} from "../LinieDeck";

import {
    a_threeSpearsOfTheGoddess
} from "../SeinDeck";

import {
    a_piercingDrill
} from "../SenseDeck";

import {
    ancientBarrierMagic
} from "../SerieDeck";

import {
    a_lightningStrike
} from "../StarkDeck";

import {
    a_geisel
} from "../StilleDeck";

export const signatureMoves: Record<CharacterName, Card> = {
    Denken: a_catastraviaBase,
    Frieren: a_vollzanbel,
    Himmel: a_realHeroSwing,
    Laufen: a_supersonicStrike,
    Linie: a_erfassenAxe,
    Sein: a_threeSpearsOfTheGoddess,
    Sense: a_piercingDrill,
    Serie: ancientBarrierMagic,
    Stark: a_lightningStrike,
    Stille: a_geisel,
    Übel: a_geisel, //CHANGE THIS LATER
} as const