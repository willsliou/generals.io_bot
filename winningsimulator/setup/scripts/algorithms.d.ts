export default class Algorithms {
    static bfs(gameState: any, gameMap: any, node: any, radius: any): {
        index: any;
        generalDistance: number;
    }[];
    static aStar(gameState: any, gameMap: any, start: any, ends: any): any[];
    static dijkstra(gameState: any, gameMap: any, start: any, end: any): any[];
    static constructDijkstraPath(start: any, end: any, previous: any): any[];
    static decisionTreeSearch(gameState: any, gameMap: any, startPoints: any, turns: any): any;
    static decisionTreeSearchRec(start: any, turns: any, weight?: number): {
        start: any;
        end: any;
        weight: any;
    };
    static getBestMove(moves: any): any;
}
