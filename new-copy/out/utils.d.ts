export declare function later(delay: number): Promise<unknown>;
export declare function random(min: number, max: number): number;
export declare class Log {
    static debugEnabled: boolean;
    static setDebugOutput(debug: boolean): void;
    static stdout(...args: string[]): void;
    static stderr(...args: string[]): void;
    static debug(...args: string[]): void;
    static debugObject(label: string, obj: any): void;
}
