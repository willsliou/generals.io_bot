export default class GameMap {
    width;
    height;
    size;
    playerIndex;
    constructor(width, height, playerIndex) {
        this.width = width;
        this.height = height;
        this.size = width * height;
        this.playerIndex = playerIndex;
    }
    isWalkable(gameState, tile) {
        return tile.value !== -4 &&
            tile.value !== -5 &&
            tile.value !== -2 &&
            !this.isCity(gameState, tile);
    }
    isCity(gameState, tile) {
        return gameState.cities.indexOf(tile.index) >= 0;
    }
    isEnemy(gameState, index) {
        return gameState.terrain[index] >= 0 && gameState.terrain[index] != this.playerIndex;
    }
    getAdjacentTiles(gameState, index) {
        let up = this.getAdjacentTile(gameState, index, -this.width);
        let right = this.getAdjacentTile(gameState, index, 1);
        let down = this.getAdjacentTile(gameState, index, this.width);
        let left = this.getAdjacentTile(gameState, index, -1);
        return {
            up, right, down, left
        };
    }
    getAdjacentTile(gameState, index, distance) {
        let adjacentIndex = index + distance;
        let curRow = Math.floor(index / this.width);
        let adjacentRow = Math.floor(adjacentIndex / this.width);
        switch (distance) {
            case 1:
            case -1:
                if (adjacentRow === curRow) {
                    return { "index": adjacentIndex, "value": gameState.terrain[adjacentIndex] };
                }
                break;
            case this.width:
                if (adjacentRow < this.height) {
                    return { "index": adjacentIndex, "value": gameState.terrain[adjacentIndex] };
                }
                break;
            case -this.width:
                if (adjacentRow >= 0) {
                    return { "index": adjacentIndex, "value": gameState.terrain[adjacentIndex] };
                }
                break;
        }
        return { "index": adjacentIndex, "value": -5 };
    }
    isAdjacentToFog(gameState, index) {
        let adjacentTiles = this.getAdjacentTiles(gameState, index);
        for (let direction in adjacentTiles) {
            if (adjacentTiles.hasOwnProperty(direction)) {
                let nextTile = adjacentTiles[direction];
                if (!gameState.discoveredTiles[nextTile.index]) {
                    return true;
                }
            }
        }
        return false;
    }
    isAdjacentToEnemy(gameState, index) {
        let adjacentTiles = this.getAdjacentTiles(gameState, index);
        for (let direction in adjacentTiles) {
            if (adjacentTiles.hasOwnProperty(direction)) {
                let nextTile = adjacentTiles[direction];
                if (nextTile.value >= 0 && nextTile.value != this.playerIndex) {
                    return true;
                }
            }
        }
        return false;
    }
    getMoveableTiles(gameState) {
        let tiles = [];
        for (var [key, value] of gameState.ownTiles) {
            if (value > 1) {
                tiles.push(key);
            }
        }
        return tiles;
    }
    remainingArmiesAfterAttack(gameState, start, end) {
        if (start > 0 && start < gameState.size && end > 0 && end < gameState.size) {
            return gameState.armies[start] - 1 - gameState.armies[end];
        }
        return 0;
    }
    getEdgeWeightForIndex(index) {
        let tileCoords = this.getCoordinatesFromTileIndex(index);
        let upperEdge = tileCoords.y;
        let rightEdge = this.width - 1 - tileCoords.x;
        let downEdge = this.height - 1 - tileCoords.y;
        let leftEdge = tileCoords.x;
        return Math.min(upperEdge, downEdge) * Math.min(leftEdge, rightEdge);
    }
    manhattenDistance(index1, index2) {
        let coord1 = this.getCoordinatesFromTileIndex(index1);
        let coord2 = this.getCoordinatesFromTileIndex(index2);
        return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
    }
    getCoordinatesFromTileIndex(index) {
        return {
            "x": Math.floor(index % this.width),
            "y": Math.floor(index / this.width)
        };
    }
}
//# sourceMappingURL=gameMap.js.map