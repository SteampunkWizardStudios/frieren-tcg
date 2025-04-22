import { MessageCache } from "../tcgChatInteractions/messageCache";
import Card from "./card";
import Game from "./game";

export type Ability = {
  abilityName: string;
  abilityEffectString: string;
  abilityStartOfTurnEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    additionalParam?: Record<any, any>
  ) => void;
  abilitySelectedMoveModifierEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityOwnCardEffectWrapper?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityAfterOwnCardUse?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityDefendEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    attackDamage: number
  ) => void;
  abilityCounterEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    attackDamage: number
  ) => void;
  abilityAfterDirectAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityAfterTimedAttackEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) => void;
  abilityAfterOpponentsMoveEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    card: Card
  ) => void;
  abilityEndOfTurnEffect?: (
    game: Game,
    characterIndex: number,
    messageCache: MessageCache,
    additionalParam?: Record<any, any>
  ) => void;
};
