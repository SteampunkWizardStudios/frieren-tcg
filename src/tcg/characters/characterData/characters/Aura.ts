import { CharacterData } from "../characterData";
import Stats, { StatsEnum } from "@tcg/stats";
import { CharacterName } from "../../metadata/CharacterName";
import { CharacterEmoji } from "@tcg/formatting/emojis";
import Pronouns from "@tcg/pronoun";
import mediaLinks from "@tcg/formatting/mediaLinks";
import { AuraPlatoon } from "../characterUtil/auraPlatoon";
import TimedEffect from "@/src/tcg/timedEffect";
import { TCGThread } from "@/src/tcgChatInteractions/sendGameMessage";
import CommonCardAction from "@/src/tcg/util/commonCardActions";
import Game from "@/src/tcg/game";
import auraDeck from "@/src/tcg/decks/AuraDeck";

const INITIAL_ARMY_STRENGTH = 60;

const INITIAL_SWORDSMEN_COUNT = 2;
export const SWORDSMEN_DAMAGE = 3;

const INITIAL_SHIELDBEARERS_COUNT = 2;
export const SHIELDBEARERS_STRENGTH_RECOVERY = 2;

const INITIAL_ARCHERS_COUNT = 2;
export const ARCHERS_DAMAGE = 1;
export const ARCHERS_PIERCE = 0.15;

const auraStats = new Stats({
  [StatsEnum.HP]: 60.0,
  [StatsEnum.ATK]: 10.0,
  [StatsEnum.DEF]: 10.0,
  [StatsEnum.TrueDEF]: 0.0,
  [StatsEnum.SPD]: 10.0,
  [StatsEnum.Ability]: 0.0,
});

const Aura = new CharacterData({
  characterName: CharacterName.Aura,
  cosmetic: {
    pronouns: Pronouns.Feminine,
    emoji: CharacterEmoji.AURA,
    color: 0xcb83b8,
    imageUrl: mediaLinks.auraPortrait,
  },
  stats: auraStats,
  cards: auraDeck,
  ability: {
    abilityName: "Until the End of Time",
    abilityEffectString: `Aura controls an undead army to do her bidding. 50% of the damage targetted towards her will be transferred to the army instead.
        Aura starts with ${INITIAL_ARMY_STRENGTH} Army Strength, 2 Swordsmen platoons, 2 Shieldbearers platoons and 2 Archers platoons.
        At the end of every turn, Aura loses soldiers by order she summoned them until #Soldier x 10 <= Army Strength`,
    abilityStartOfTurnEffect: (game, characterIndex, messageCache) => {
      const self = game.getCharacter(characterIndex);

      if (game.turnCount === 1) {
        self.adjustStat(INITIAL_ARMY_STRENGTH, StatsEnum.Ability, game);

        const initialPlatoons = [
          ...new Array(INITIAL_SWORDSMEN_COUNT).fill(AuraPlatoon.Swordsmen),
          ...new Array(INITIAL_SHIELDBEARERS_COUNT).fill(
            AuraPlatoon.Shieldbearers
          ),
          ...new Array(INITIAL_ARCHERS_COUNT).fill(AuraPlatoon.Archers),
        ];
        for (let i = initialPlatoons.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [initialPlatoons[i], initialPlatoons[j]] = [
            initialPlatoons[j],
            initialPlatoons[i],
          ];
        }
        self.additionalMetadata.auraPlatoonQueue = initialPlatoons;
      }

      // apply effect if turn not skipped
      if (!self.skipTurn) {
        const opponent = game.getCharacter(1 - characterIndex);

        const swordsmenCount = self.additionalMetadata.auraPlatoonQueue.filter(
          (p) => p === AuraPlatoon.Swordsmen
        ).length;
        if (swordsmenCount > 0) {
          const swordsmenDamage = SWORDSMEN_DAMAGE * swordsmenCount;
          self.timedEffects.push(
            new TimedEffect({
              name: "Undead Swordsmen",
              description: `Deal ${swordsmenDamage} at turn's end.`,
              turnDuration: 1,
              executeEndOfTimedEffectActionOnRemoval: false,
              endOfTurnAction: function (
                this: TimedEffect,
                _game,
                _characterIndex
              ) {
                messageCache.push(
                  `The undead swordsmen swing blindly.`,
                  TCGThread.Gameroom
                );
                CommonCardAction.commonAttack(game, characterIndex, {
                  damage: swordsmenDamage,
                  isTimedEffectAttack: true,
                });
                const auraRotDamage =
                  self.additionalMetadata.auraRotDamage ?? 0;
                if (auraRotDamage > 0) {
                  opponent.adjustStat(-auraRotDamage, StatsEnum.HP, game);
                }
              },
            })
          );
        }

        const shieldbearersCount =
          self.additionalMetadata.auraPlatoonQueue.filter(
            (p) => p === AuraPlatoon.Shieldbearers
          ).length;
        if (shieldbearersCount > 0) {
          self.adjustStat(
            SHIELDBEARERS_STRENGTH_RECOVERY * shieldbearersCount,
            StatsEnum.Ability,
            game
          );
        }

        const archersCount = self.additionalMetadata.auraPlatoonQueue.filter(
          (p) => p === AuraPlatoon.Archers
        ).length;
        if (archersCount > 0) {
          self.timedEffects.push(
            new TimedEffect({
              name: "Undead Archers",
              description: `Deal ${ARCHERS_DAMAGE} DMG x ${archersCount} Times at turn's end, with ${(ARCHERS_PIERCE * 100).toFixed(0)}% Pierce.`,
              turnDuration: 1,
              endOfTurnAction: () => {
                messageCache.push(
                  `The undead archers fire a volley.`,
                  TCGThread.Gameroom
                );
                const auraRotDamage =
                  self.additionalMetadata.auraRotDamage ?? 0;

                for (let i = 0; i < archersCount; i++) {
                  CommonCardAction.commonAttack(game, characterIndex, {
                    damage: ARCHERS_DAMAGE,
                    isTimedEffectAttack: true,
                    additionalPierceFactor: ARCHERS_PIERCE,
                  });
                  if (auraRotDamage > 0) {
                    opponent.adjustStat(-auraRotDamage, StatsEnum.HP, game);
                  }
                }
              },
            })
          );
        }
      }
    },
    abilityAfterOwnCardUse: function (
      game,
      characterIndex,
      _messageCache,
      card
    ) {
      const character = game.getCharacter(characterIndex);
      if (card.cardMetadata.armyStrength) {
        character.adjustStat(
          card.cardMetadata.armyStrength,
          StatsEnum.Ability,
          game
        );
      }
    },
    abilityDefendEffect: (
      game: Game,
      characterIndex: number,
      _messageCache,
      _attackDamage
    ) => {
      // damage calculation routine is done in game.ts
      const character = game.getCharacter(characterIndex);
      const damageAbsorbtion =
        character.additionalMetadata.auraArmyDamageAbsorbtion;
      character.additionalMetadata.defenderDamageScaling =
        1.0 - damageAbsorbtion;
    },
    abilityEndOfTurnEffect(this, game, characterIndex, messageCache) {
      const self = game.getCharacter(characterIndex);
      const queue = self.additionalMetadata.auraPlatoonQueue;
      let removeCount = 0;

      while ((queue.length - removeCount) * 10 > self.stats.stats.Ability) {
        const removedPlatoon = queue[removeCount];
        if (removedPlatoon) {
          switch (removedPlatoon) {
            case AuraPlatoon.Swordsmen:
              messageCache.push(
                `${self.name}'s undead swordsmen fall.`,
                TCGThread.Gameroom
              );
              self.adjustStat(-2, StatsEnum.ATK, game);
              break;
            case AuraPlatoon.Shieldbearers:
              messageCache.push(
                `${self.name}'s undead shieldbearers fall.`,
                TCGThread.Gameroom
              );
              self.adjustStat(-2, StatsEnum.DEF, game);
              break;
            case AuraPlatoon.Archers:
              messageCache.push(
                `${self.name}'s undead archers fall.`,
                TCGThread.Gameroom
              );
              self.adjustStat(-2, StatsEnum.SPD, game);
              break;
          }
          removeCount++;
        } else {
          break;
        }
      }

      // Remove processed elements once at the end
      if (removeCount > 0) {
        self.additionalMetadata.auraPlatoonQueue = queue.slice(removeCount);
      }
    },
  },
  additionalMetadata: {
    auraArmyDamageAbsorbed: true,
    auraArmyDamageAbsorbtion: 0.5,
    auraRotDamage: 0.0,
  },
});

export default Aura;
