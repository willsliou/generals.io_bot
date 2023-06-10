/// <reference path="../../app.d.ts" />
import type GameMap from "./gameMap.js";
import type GameState from "./gameState.js";
export default class Heuristics {
    static chooseDiscoverTile(gameMap: GameMap, tiles: {
        index: number;
        generalDistance: number;
    }[]): number;
    static chooseEnemyTargetTileByLowestArmy(gameState: GameState, gameMap: GameMap): any;
    static calcCaptureWeight(playerIndex: any, terrainValue: any): 1 | 0 | 3;
}
