export default class Heuristics {
    static chooseDiscoverTile(gameMap, tiles) {
        let optimalTile = { "index": -1, "edgeWeight": -1 };
        let maxGeneralDistance = tiles[tiles.length - 1].generalDistance;
        for (let i = tiles.length - 1; i >= 0; i--) {
            let tile = tiles[i];
            let edgeWeight = gameMap.getEdgeWeightForIndex(tile.index);
            if (tile.generalDistance < maxGeneralDistance) {
                return optimalTile.index;
            }
            if (edgeWeight > optimalTile.edgeWeight) {
                optimalTile.index = tile.index;
                optimalTile.edgeWeight = edgeWeight;
            }
        }
        if (optimalTile.index != -1) {
            return optimalTile.index;
        }
        else {
            console.log("No tile found. Something is going wrong here!");
            return null;
        }
    }
    static chooseEnemyTargetTileByLowestArmy(gameState, gameMap) {
        let tilesWithFog = [];
        for (let [key, value] of gameState.enemyTiles) {
            if (gameMap.isAdjacentToFog(gameState, key)) {
                tilesWithFog.push({ "index": key, "value": value });
            }
        }
        if (tilesWithFog.length == 0) {
            return null;
        }
        return tilesWithFog.reduce((a, b) => (a.value < b.value) ? a : b);
    }
    static calcCaptureWeight(playerIndex, terrainValue) {
        if (terrainValue == playerIndex) {
            return 0;
        }
        else if (terrainValue == -1 || terrainValue == -3) {
            return 1;
        }
        else if (terrainValue < 0) {
            return 3;
        }
        return 1;
    }
}
//# sourceMappingURL=heuristics.js.map