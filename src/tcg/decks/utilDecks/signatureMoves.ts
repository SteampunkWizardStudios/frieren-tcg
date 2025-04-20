import { CharacterName } from "../../characters/metadata/CharacterName"
import Card from "../../card"
import { a_catastraviaBase } from "../DenkenDeck"
import { a_theHeightOfMagic } from "../FrierenDeck"
import { a_realHeroSwing } from "../HimmelDeck"
import { a_supersonicStrike } from "../LaufenDeck"
import { imitate } from "../LinieDeck"
import { a_threeSpearsOfTheGoddess } from "../SeinDeck"
import { a_piercingDrill } from "../SenseDeck"
import { ancientBarrierMagic } from "../SerieDeck"
import { a_lightningStrike } from "../StarkDeck"
import { a_geisel } from "../StilleDeck"
import { a_malevolentShrine } from "../UbelDeck"


export const signatureMoves : Record<CharacterName, Card> = {
    [CharacterName.Denken]: a_catastraviaBase,
    [CharacterName.Frieren]: a_theHeightOfMagic,
    [CharacterName.Himmel]: a_realHeroSwing,
    [CharacterName.Laufen]: a_supersonicStrike,
    [CharacterName.Linie]: imitate,
    [CharacterName.Sein]: a_threeSpearsOfTheGoddess,
    [CharacterName.Sense]: a_piercingDrill,
    [CharacterName.Serie]: ancientBarrierMagic,
    [CharacterName.Stark]: a_lightningStrike,
    [CharacterName.Stille]: a_geisel,
    [CharacterName.Ubel]: a_malevolentShrine,
}