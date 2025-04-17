import { CharacterData } from "../characterData";
import { ubelDeck } from "../../../decks/UbelDeck";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import Rolls from "../../../util/rolls";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const ubelStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 8.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

export const Ubel = new CharacterData({
  name: CharacterName.Ubel,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.UBEL,
    color: 0x3C5502,
    imageUrl:
      "https://cdn.discordapp.com/attachments/1147147425878921240/1361843328596840558/Xdt0V0dFkFFUIynaHzeRl4CDSpdXIIyx.png?ex=68003aef&is=67fee96f&hm=272a9e1a94f2bae706b259a9cf6e7b19eb135bab69b8bfff26c343be7744c318&",
  },
  stats: ubelStats,
  cards: ubelDeck,
  ability: {
    abilityName: "Battle-crazed weirdo",
    abilityEffectString: "Übel's attack ignore the opponent's defense stats, but are blocked by defensive moves.",

    
    
    
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    pierceFactor: 0.5,
  },
});
