export default class Bot {
    constructor(socket: any, playerIndex: any, data: any);
    moveCount: number;
    socket: any;
    queuedMoves: number;
    lastAttackedIndex: number;
    isCollecting: boolean;
    collectArea: any[];
    isInfiltrating: boolean;
    gameState: GameState;
    gameMap: GameMap;
    update(data: any): void;
    queueMoves(moves: any): void;
    move(move: any): void;
}
import GameState from "./gameState.js";
import GameMap from "./gameMap.js";
