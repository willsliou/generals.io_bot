import Spread from './strategies/spread.js';
import Discover from './strategies/discover.js';
import Collect from './strategies/collect.js';
import Infiltrate from './strategies/infiltrate.js';
import RushGeneral from './strategies/rushGeneral.js';
import Algorithms from './algorithms.js';
const INITIAL_WAIT_TURNS = 23;
const REINFORCEMENT_INTERVAL = 50;
const SPREADING_TIMES = 4;
const ATTACK_TURNS_BEFORE_REINFORCEMENTS = 10;
export default class Strategy {
    static pickStrategy(bot) {
        let turn = bot.gameState.turn;
        if (bot.gameState.enemyGeneral != -1) {
            this.endGame(bot);
        }
        else if (bot.isInfiltrating) {
            Infiltrate.infiltrate(bot);
        }
        else if (turn % REINFORCEMENT_INTERVAL == 0 &&
            (turn / REINFORCEMENT_INTERVAL <= SPREADING_TIMES || bot.gameState.enemyTiles.size == 0)) {
            Spread.spread(bot);
        }
        else if (turn < REINFORCEMENT_INTERVAL) {
            this.earlyGame(bot, turn);
        }
        else {
            this.midGame(bot, turn);
        }
    }
    static earlyGame(bot, turn) {
        if (turn <= INITIAL_WAIT_TURNS) {
        }
        else if (turn == INITIAL_WAIT_TURNS + 1) {
            Discover.first(bot, INITIAL_WAIT_TURNS);
        }
        else if (bot.queuedMoves == 0) {
            Discover.second(bot, INITIAL_WAIT_TURNS);
        }
    }
    static midGame(bot, turn) {
        if (bot.gameState.enemyTiles.size > 0 && bot.collectArea.length > 1 &&
            (turn + ATTACK_TURNS_BEFORE_REINFORCEMENTS + bot.collectArea.length - 1) % REINFORCEMENT_INTERVAL == 0) {
            if (bot.collectArea.length == 2) {
                bot.isInfiltrating = true;
            }
            let start = bot.collectArea.shift();
            let end = bot.collectArea[0];
            bot.move({ "start": start, "end": end });
        }
        else if (!bot.isInfiltrating) {
            bot.collectArea = Collect.getCollectArea(bot);
            if (bot.queuedMoves == 0) {
                Collect.collect(bot);
            }
        }
    }
    static endGame(bot) {
        if (!bot.isInfiltrating) {
            RushGeneral.rush(bot);
        }
        else {
            if (!RushGeneral.tryToKillGeneral(bot)) {
                let pathToGeneral = Algorithms.aStar(bot.gameState, bot.gameMap, bot.lastAttackedIndex, [bot.gameState.enemyGeneral]);
                if (pathToGeneral.length <= 2 || bot.gameMap.remainingArmiesAfterAttack(bot.gameState, pathToGeneral[0], pathToGeneral[1]) <= 1) {
                    bot.isInfiltrating = false;
                }
                if (pathToGeneral.length > 2) {
                    bot.move({ "start": pathToGeneral[0], "end": pathToGeneral[1] });
                }
            }
        }
    }
}
//# sourceMappingURL=strategy.js.map