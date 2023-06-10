import Algorithms from '../algorithms.js';
import Heuristics from '../heuristics.js';
export default class Discover {
    static first(bot, waitTurns) {
        let radius = this.armiesReceivedTillTurn(waitTurns + 1);
        let reachableTiles = Algorithms.bfs(bot.gameState, bot.gameMap, bot.gameState.ownGeneral, radius);
        let discoverTile = Heuristics.chooseDiscoverTile(bot.gameMap, reachableTiles);
        let moves = Algorithms.dijkstra(bot.gameState, bot.gameMap, bot.gameState.ownGeneral, discoverTile);
        bot.queueMoves(moves);
    }
    static second(bot, waitTurns) {
        let turns = Math.ceil((waitTurns + 1) / 2 / 2);
        let moveableTiles = bot.gameMap.getMoveableTiles(bot.gameState);
        if (moveableTiles.length > 0) {
            let move = Algorithms.decisionTreeSearch(bot.gameState, bot.gameMap, moveableTiles, turns);
            bot.move(move);
        }
    }
    static armiesReceivedTillTurn(turn) {
        return (turn / 2) + 1;
    }
}
//# sourceMappingURL=discover.js.map