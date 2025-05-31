import Game from "@tcg/game";
import TimedEffect from "@tcg/timedEffect";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";

export default class CommonCardAction {
  // common attack function that returns the attack's damage
  static commonAttack(
    game: Game,
    characterIndex: number,
    option: {
      damage: number;
      isTimedEffectAttack?: boolean;
      additionalPierceFactor?: number;
    }
  ): number {
    const isTimedEffectAttack = option.isTimedEffectAttack ?? false;
    const character = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(1 - characterIndex);
    const pierceFactor =
      character.additionalMetadata.pierceFactor +
      (option.additionalPierceFactor ?? 0);

    const actualDamage = game.attack({
      attackerIndex: characterIndex,
      damage: option.damage + pierceFactor * opponent.stats.stats.DEF,
      isTimedEffectAttack,
    });
    return actualDamage;
  }

  // function that looks up a character's timed effect and replace a timed effect with certain tag
  static replaceOrAddNewTimedEffect(
    game: Game,
    characterIndex: number,
    metadata: keyof TimedEffect["metadata"],
    newTimedEffect: TimedEffect
  ) {
    const character = game.getCharacter(characterIndex);
    const timedEffectIndex = character.timedEffects.findIndex(
      (timedEffect) => metadata in timedEffect.metadata
    );
    if (timedEffectIndex !== -1) {
      const previousTimedEffect = character.timedEffects.splice(
        timedEffectIndex,
        1,
        newTimedEffect
      );
      previousTimedEffect[0].replacedAction?.(
        game,
        characterIndex,
        game.messageCache
      );
    } else {
      character.timedEffects.push(newTimedEffect);
    }
  }

  // function used by sorganeil and sleep to remove opponent's timed effect
  static removeCharacterTimedEffect(
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
  ) {
    const character = game.getCharacter(characterIndex);
    const newTimedEffects: TimedEffect[] = [];
    character.timedEffects.map((timedEffect) => {
      if (!timedEffect.metadata.removableBySorganeil) {
        newTimedEffects.push(timedEffect);
      } else {
        if (
          timedEffect.executeEndOfTimedEffectActionOnRemoval &&
          timedEffect.endOfTimedEffectAction
        ) {
          timedEffect.endOfTimedEffectAction(
            game,
            1 - characterIndex,
            messageCache
          );
        }
      }
    });
    character.timedEffects = newTimedEffects;
  }
}
