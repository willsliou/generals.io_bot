export default class GameState {
    constructor(data: any, playerIndex: any);
    cities: any[];
    map: any[];
    playerIndex: any;
    ownTiles: Map<any, any>;
    enemyTiles: Map<any, any>;
    discoveredTiles: any;
    ownGeneral: number;
    enemyGeneral: number;
    update(data: any): void;
    generals: any;
    turn: any;
    width: any;
    height: any;
    size: number;
    armies: any[];
    terrain: any[];
    updatePlayerTiles(): void;
    updateDiscoveredTiles(): void;
    updateGenerals(): void;
}
