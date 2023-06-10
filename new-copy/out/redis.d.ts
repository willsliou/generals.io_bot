/// <reference path="../app.d.ts" />
export default class Redis {
    private readonly publisher;
    private readonly subscriber;
    private readonly CHANNEL_PREFIX;
    private readonly EXPIRATION_TIME;
    private gameKeyspace;
    constructor(redisConfig: Config.Redis);
    listPush(list: RedisData.LIST, data: any): void;
    setKeys(keyValues: Record<string, any>): Promise<number>;
    getKeys(...keys: Array<string>): Promise<string[]>;
    getAllKeys(): Promise<{
        [x: string]: string;
    }>;
    publish(channel: RedisData.CHANNEL, data: any): Promise<number>;
    setKeyspaceName(keyspace: string): void;
    subscribe(channel: RedisData.CHANNEL, callback: (data: any) => void): Promise<string>;
    quit(): Promise<void>;
}
