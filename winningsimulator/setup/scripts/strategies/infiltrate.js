import Algorithms from '../algorithms.js';
export default class Infiltrate {
    static infiltrate(bot) {
        let enemyNeighbor = -1;
        if (this.lastAttackedIndexIsValid(bot)) {
            let attackSource = bot.lastAttackedIndex;
            let adjacentTiles = bot.gameMap.getAdjacentTiles(bot.gameState, attackSource);
            for (let direction in adjacentTiles) {
                if (adjacentTiles.hasOwnProperty(direction)) {
                    let nextTile = adjacentTiles[direction];
                    if (bot.gameMap.isEnemy(bot.gameState, nextTile.index) &&
                        bot.gameMap.isWalkable(bot.gameState, nextTile.index) &&
                        bot.gameMap.isAdjacentToFog(bot.gameState, nextTile.index)) {
                        if (enemyNeighbor == -1 ||
                            bot.gameState.armies[nextTile.index] < bot.gameState.armies[enemyNeighbor.index]) {
                            enemyNeighbor = nextTile;
                        }
                    }
                }
            }
            let start = attackSource;
            let end = -1;
            if (enemyNeighbor != -1) {
                end = enemyNeighbor.index;
            }
            else {
                let path = this.getPathToNextTile(bot, attackSource);
                if (path.length > 1) {
                    end = path[1];
                }
            }
            if (end == -1 || bot.gameMap.remainingArmiesAfterAttack(bot.gameState, start, end) <= 1) {
                bot.isInfiltrating = false;
            }
            if (end != -1 && bot.gameMap.remainingArmiesAfterAttack(bot.gameState, start, end) >= 1) {
                bot.move({ "start": start, "end": end });
            }
        }
        else {
            bot.isInfiltrating = false;
        }
    }
    static lastAttackedIndexIsValid(bot) {
        return bot.lastAttackedIndex != -1 && bot.gameState.terrain[bot.lastAttackedIndex] == bot.gameState.playerIndex;
    }
    static getPathToNextTile(bot, index) {
        let tilesWithFog = [];
        for (let [key, value] of bot.gameState.enemyTiles) {
            if (bot.gameMap.isAdjacentToFog(bot.gameState, key)) {
                tilesWithFog.push(key);
            }
        }
        if (tilesWithFog.length > 0) {
            return Algorithms.aStar(bot.gameState, bot.gameMap, index, tilesWithFog);
        }
        return [];
    }
}
//# sourceMappingURL=infiltrate.js.map