/// <reference path="../../app.d.ts" />
import type GameState from "./gameState.js";
export default class GameMap {
    width: number;
    height: number;
    size: number;
    playerIndex: number;
    constructor(width: number, height: number, playerIndex: number);
    isWalkable(gameState: GameState, tile: GeneralsIO.Tile): boolean;
    isCity(gameState: GameState, tile: GeneralsIO.Tile): boolean;
    isEnemy(gameState: any, index: any): boolean;
    getAdjacentTiles(gameState: GameState, index: number): {
        up: GeneralsIO.Tile;
        right: GeneralsIO.Tile;
        down: GeneralsIO.Tile;
        left: GeneralsIO.Tile;
    };
    getAdjacentTile(gameState: GameState, index: number, distance: number): GeneralsIO.Tile;
    isAdjacentToFog(gameState: any, index: any): boolean;
    isAdjacentToEnemy(gameState: any, index: any): boolean;
    getMoveableTiles(gameState: any): any[];
    remainingArmiesAfterAttack(gameState: any, start: any, end: any): number;
    getEdgeWeightForIndex(index: any): number;
    manhattenDistance(index1: any, index2: any): number;
    getCoordinatesFromTileIndex(index: any): {
        x: number;
        y: number;
    };
}
