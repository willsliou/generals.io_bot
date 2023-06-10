import Heuristics from '../heuristics.js';
import Algorithms from '../algorithms.js';
export default class Collect {
    static getCollectArea(bot) {
        let gameState = bot.gameState;
        let gameMap = bot.gameMap;
        bot.isCollecting = true;
        if (gameState.enemyTiles.size > 0) {
            let enemyTarget = Heuristics.chooseEnemyTargetTileByLowestArmy(gameState, gameMap);
            if (enemyTarget != null) {
                let pathToEnemy = Algorithms.aStar(gameState, gameMap, gameState.ownGeneral, [enemyTarget.index]);
                return pathToEnemy;
            }
        }
        return [gameState.ownGeneral];
    }
    static collect(bot) {
        let highestArmyIndex = this.getHighestArmyIndex(bot.gameState.ownTiles, bot.collectArea);
        if (highestArmyIndex == -1) {
            bot.isCollecting = false;
        }
        else {
            let pathToAttackingPath = Algorithms.aStar(bot.gameState, bot.gameMap, highestArmyIndex, bot.collectArea);
            if (pathToAttackingPath.length > 1) {
                bot.move({ "start": highestArmyIndex, "end": pathToAttackingPath[1] });
            }
        }
    }
    static getHighestArmyIndex(tiles, path) {
        let index = -1;
        let armies = 0;
        for (let [key, value] of tiles) {
            if (value > armies && value > 1 && !path.includes(key)) {
                index = key;
                armies = value;
            }
        }
        return index;
    }
}
//# sourceMappingURL=collect.js.map