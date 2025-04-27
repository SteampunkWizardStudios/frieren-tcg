import Game from "@src/tcg/game";
import { MessageCache } from "@src/tcgChatInteractions/messageCache";
import { TCGThread } from "@src/tcgChatInteractions/sendGameMessage";
import { StatsEnum } from "@src/tcg/stats";
import Character from "@src/tcg/character";
import Card from "@src/tcg/card";
import CommonCardAction from "./util/commonCardActions";

// #region from Card.ts
const EMPOWER_BOOST = 0.1;

const calculateEffectValue = (baseValue: number, empowerLevel: number) => {
    return Number((baseValue * (1 + empowerLevel * EMPOWER_BOOST)).toFixed(2));
};
// #endregion

/**
 * Provides convenience methods and properties for cardActions.
 */
export default function gameContextProvider(
    this: Card,
    game: Game,
    characterIndex: number,
    messageCache: MessageCache
) {
    const changeStat = (target: Character, amount: number, stat: StatsEnum, multiplier: number = 1) => {
        const change = amount * multiplier;
        target.adjustStat(change, stat);
        return change;
    };
    const changeStatWithEmpower = (
        target: Character,
        stat: StatsEnum,
        effectIndex: number,
        multiplier: number = 1,
    ) => {
        const empowered = calculateEffectValue(
            this.effects[effectIndex],
            this.empowerLevel
        );
        const change = empowered * multiplier;
        target.adjustStat(change, stat);
        return change;
    };
    const flatAttack = (damage: number, hpCost: number) => {
        return CommonCardAction.commonAttack(game, characterIndex, {
            damage,
            hpCost,
        });
    }

    const calcEffect = (effectIndex: number) => {
        return calculateEffectValue(
            this.effects[effectIndex],
            this.empowerLevel
        );
    }

    const self = game.getCharacter(characterIndex);
    const opponent = game.getCharacter(characterIndex - 1);

    const sendToGameroom = (message: string) => {
        messageCache.push(message, TCGThread.Gameroom);
    };

    const flatSelfStat = changeStat.bind(null, self);
    const selfStat = changeStatWithEmpower.bind(null, self);
    const flatOpponentStat = changeStat.bind(null, opponent);
    const opponentStat = changeStatWithEmpower.bind(null, opponent);

    const basicAttack = (effectIndex: number, hpCost: number) => {
        const damage = calculateEffectValue(
            this.effects[effectIndex],
            this.empowerLevel
        );
        flatAttack(damage, hpCost);
        return damage;
    };

    return {
        selfIndex: characterIndex,
        self,
        flatSelfStat,
        selfStat,
        basicAttack,
        flatAttack,
        calcEffect,
        selfStats: self.stats.stats,

        name: self.name,
        reflexive: self.cosmetic.pronouns.reflexive,
        possessive: self.cosmetic.pronouns.possessive,

        opponent,
        opponentStats: opponent.stats.stats,
        flatOpponentStat,
        opponentStat,

        messageCache,
        sendToGameroom,

        game,
    };
}
