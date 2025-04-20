import { CharacterData } from "../characterData";
import { UbelHit } from "../../../additionalMetadata/characterAdditionalMetadata";
import { ubelDeck, empathyFailureName } from "../../../decks/UbelDeck";
import Stats from "../../../stats";
import { StatsEnum } from "../../../stats";
import Game from "../../../game";
import Card, { Nature } from "../../../card";
import Rolls from "../../../util/rolls";
import Character from "../../../character";
import { CharacterName } from "../../metadata/CharacterName";
import { MessageCache } from "../../../../tcgChatInteractions/messageCache";
import { TCGThread } from "../../../../tcgChatInteractions/sendGameMessage";
import { CharacterEmoji } from "../../../formatting/emojis";

const PIERCE_FACTOR = 0.5;

const ubelStats = new Stats({
  [StatsEnum.HP]: 90.0,
  [StatsEnum.ATK]: 12.0,
  [StatsEnum.DEF]: 8.0,
  [StatsEnum.SPD]: 14.0,
  [StatsEnum.Ability]: 0.0,
});

function checkForEffects(effects: string[]): Record<string, boolean> {
  const effectsListToCheckFor = ["Sorganeil", "Rushdown", "Recompose"];
  const presence = effectsListToCheckFor.map((effect) =>
    effects.includes(effect)
  );
  const result: Record<string, boolean> = {
    Sorganeil: presence[0],
    Rushdown: presence[1],
    Recompose: presence[2],
  };
  return result;
}

function missAttack(
  game: Game,
  characterIndex: number,
  messageCache: MessageCache,
  card: Card,
  failureRate: number
) {
  // Non Ubel slashing sureHits get treated normally
  if (failureRate === 0) {
    card.cardAction(game, characterIndex, messageCache);
    return;
  }

  const hpCost = card.hpCost;
  game.getCharacter(characterIndex).adjustStat(-hpCost, StatsEnum.HP);
  messageCache.push("The attack misses!", TCGThread.Gameroom);
}

function attackWhileRecomposing(
  character: Character,
  messageCache: MessageCache
) {
  messageCache.push(
    `${character.name} is recomposing herself and can't attack`,
    TCGThread.Gameroom
  );
}

function playOffensiveCard(
  game: Game,
  characterIndex: number,
  card: Card,
  failureRate: number,
  messageCache: MessageCache
): void {
  // check for always hitting empathy attacks
  if (failureRate === 0) {
    card.cardAction?.(game, characterIndex, messageCache);
    return;
  }

  const luckRoll = Rolls.rollD100();
  messageCache.push(
    `## **Missing chances:** ${failureRate}%`,
    TCGThread.Gameroom
  );
  messageCache.push(`# Luck roll: ${luckRoll}`, TCGThread.Gameroom);
  if (luckRoll < failureRate) {
    missAttack(game, characterIndex, messageCache, card, failureRate);
  } else {
    messageCache.push("The attack connects!", TCGThread.Gameroom);
    card.cardAction?.(game, characterIndex, messageCache);
  }
}

function wrapEmpathizedCard(
  character: Character,
  card: Card,
  messageCache: MessageCache
): void {
  messageCache.push(
    `${character.name} tries to empathize with ${character.cosmetic.pronouns.possessive} opponent...`,
    TCGThread.Gameroom
  );

  //empathy before the minimum turn number
  if (card.title == empathyFailureName) {
    return;
  }

  messageCache.push(
    `${character.name} acquired a new magic!`,
    TCGThread.Gameroom
  );
}

export const Ubel = new CharacterData({
  name: CharacterName.Ubel,
  cosmetic: {
    pronouns: {
      possessive: "her",
      reflexive: "herself",
    },
    emoji: CharacterEmoji.UBEL,
    color: 0x3c5502,
    imageUrl:
      "https://images-ext-1.discordapp.net/external/T8sKlCzZxYVznbr_nMT7c2GR556S5JQs-2NGeGiSm9Q/%3Fcb%3D20240112114604/https/static.wikia.nocookie.net/frieren/images/4/43/%25C3%259Cbel_anime_portrait.png/revision/latest?format=webp&width=375&height=375",
  },
  stats: ubelStats,
  cards: ubelDeck,
  ability: {
    abilityName: "Reckless",
    abilityEffectString: `Übel's slashing attacks ignore ${PIERCE_FACTOR * 100}% the opponent's defense stats, but are blocked by defensive moves.`,

    // same turn surehit effect changes
    abilityAfterOpponentsMoveEffect: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      const opponent = game.getCharacter(1 - characterIndex);
      const effects = character.timedEffects.map((effect) => effect.name);
      const activeEffects = checkForEffects(effects);

      switch (card.cardMetadata.nature) {
        case "Attack":
          if (!activeEffects.Recompose) {
            character.additionalMetadata.sureHit = UbelHit.SureHit;
            messageCache.push(
              `${opponent.name} is wide-open!`,
              TCGThread.Gameroom
            );
          }
          break;
        case "Defense":
          character.additionalMetadata.sureHit = UbelHit.SureMiss;
          messageCache.push(
            `${character.name} can't cut through this!`,
            TCGThread.Gameroom
          );
          break;
        default:
          if (
            !activeEffects.Recompose &&
            !activeEffects.Rushdown &&
            !activeEffects.Sorganeil
          ) {
            character.additionalMetadata.sureHit = UbelHit.Regular;
          }
      }
    },

    // new turn surehit effect changes
    abilityStartOfTurnEffect: function (game, characterIndex, messageCache) {
      const character = game.getCharacter(characterIndex);
      const effects = character.timedEffects.map((effect) => effect.name);
      const activeEffects = checkForEffects(effects);

      if (activeEffects.Sorganeil || activeEffects.Rushdown) {
        character.additionalMetadata.sureHit = UbelHit.SureHit;
      } else if (activeEffects.Recompose) {
        character.additionalMetadata.sureHit = UbelHit.SureMiss;
      } else {
        switch (character.additionalMetadata.sureHit) {
          case UbelHit.SureHit:
            if (
              game.additionalMetadata.lastUsedCards[1 - characterIndex]
                .cardMetadata.nature != "Attack"
            ) {
              character.additionalMetadata.sureHit = UbelHit.Regular;
            }
            break;
          case UbelHit.SureMiss:
            character.additionalMetadata.sureHit = UbelHit.Regular;
            break;
          default:
          // do nothing
        }
      }
    },

    // attacks should potentially fail
    abilityOwnCardEffectWrapper: function (
      game: Game,
      characterIndex: number,
      messageCache: MessageCache,
      card: Card
    ) {
      const character = game.getCharacter(characterIndex);
      const effects = character.timedEffects;
      const effectsNames = effects.map((eff) => eff.name);
      const activeEffects = checkForEffects(effectsNames);

      //routine for empathized cards, all cases are treated within the function itself
      if (card.empathized) {
        wrapEmpathizedCard(character, card, messageCache);
      }

      //utils and default cards don't care about hitting status
      if (card.cardMetadata.nature != Nature.Attack) {
        card.cardAction?.(game, characterIndex, messageCache);
        return;
      }

      //attacks
      const failureRate = card.cardMetadata.ubelFailureRate ?? 0;
      switch (character.additionalMetadata.sureHit) {
        case UbelHit.Regular:
          playOffensiveCard(
            game,
            characterIndex,
            card,
            failureRate,
            messageCache
          );
          break;
        case UbelHit.SureHit:
          card.cardAction?.(game, characterIndex, messageCache);
          break;
        case UbelHit.SureMiss:
          // defensive move
          if (!activeEffects.Recompose) {
            missAttack(game, characterIndex, messageCache, card, failureRate);
            return;
          }
          // Recomposing
          if (activeEffects.Sorganeil) {
            card.cardAction?.(game, characterIndex, messageCache);
          } else {
            attackWhileRecomposing(character, messageCache);
          }
          break;
      }
    },
  },
  additionalMetadata: {
    attackedThisTurn: false,
    timedEffectAttackedThisTurn: false,
    accessToDefaultCardOptions: true,
    manaSuppressed: false,
    defenseDamageReduction: 0,
    pierceFactor: PIERCE_FACTOR,
    sureHit: UbelHit.Regular,
  },
});
