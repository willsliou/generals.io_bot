export default class Strategy {
    static pickStrategy(bot: any): void;
    static earlyGame(bot: any, turn: any): void;
    static midGame(bot: any, turn: any): void;
    static endGame(bot: any): void;
}
