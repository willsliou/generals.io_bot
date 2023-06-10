import { createClient } from '@redis/client';
import { Log } from './utils.js';
export default class Redis {
    publisher;
    subscriber;
    CHANNEL_PREFIX;
    EXPIRATION_TIME = 60 * 60 * 24 * 365;
    gameKeyspace;
    constructor(redisConfig) {
        Log.debug(`[Redis] Initializing Redis: ${redisConfig.HOST}`);
        this.CHANNEL_PREFIX = redisConfig.CHANNEL_PREFIX;
        this.EXPIRATION_TIME = redisConfig.EXPIRATION_TIME || this.EXPIRATION_TIME;
        let clientConfig = {
            username: redisConfig.USERNAME,
            password: redisConfig.PASSWORD,
            socket: {
                host: redisConfig.HOST,
                port: redisConfig.PORT,
                tls: redisConfig.TLS,
                servername: redisConfig.HOST,
            }
        };
        this.subscriber = createClient(clientConfig);
        this.subscriber.on('error', (error) => Log.stderr(`[Redis] ${error}`));
        this.subscriber.connect();
        this.publisher = createClient(clientConfig);
        this.publisher.on('error', (error) => Log.stderr(`[Redis] ${error}`));
        this.publisher.connect();
    }
    listPush(list, data) {
        this.publisher.rPush(this.gameKeyspace + '-' + list, JSON.stringify(data));
        this.publisher.expire(this.gameKeyspace + '-' + list, this.EXPIRATION_TIME);
    }
    setKeys(keyValues) {
        for (let key in keyValues) {
            keyValues[key] = JSON.stringify(keyValues[key]);
        }
        this.publisher.expire(this.gameKeyspace, this.EXPIRATION_TIME);
        return this.publisher.hSet(this.gameKeyspace, keyValues);
    }
    async getKeys(...keys) {
        let values = await this.publisher.hmGet(this.gameKeyspace, keys);
        for (let key in values) {
            values[key] = JSON.parse(values[key]);
        }
        return values;
    }
    async getAllKeys() {
        let values = await this.publisher.hGetAll(this.gameKeyspace);
        for (let key in values) {
            values[key] = JSON.parse(values[key]);
        }
        return values;
    }
    publish(channel, data) {
        return this.publisher.publish(this.CHANNEL_PREFIX + '-' + channel, JSON.stringify(data));
    }
    setKeyspaceName(keyspace) {
        this.gameKeyspace = `${this.CHANNEL_PREFIX}-${keyspace}`;
    }
    async subscribe(channel, callback) {
        const CHANNEL_NAME = this.CHANNEL_PREFIX + '-' + channel;
        Log.debug('[Redis] subscribe:', CHANNEL_NAME);
        let handleResponse = (message) => {
            let data;
            try {
                data = JSON.parse(message);
            }
            catch (error) {
                Log.stderr('[JSON] received:', message, ', error:', error);
                return;
            }
            callback(data);
        };
        await this.subscriber.subscribe(CHANNEL_NAME, handleResponse);
        Log.debug('[Redis] subscribed:', CHANNEL_NAME);
        return CHANNEL_NAME;
    }
    async quit() {
        let promises = [];
        if (this.subscriber.isReady) {
            Log.stdout('Closing Redis subscriber...');
            promises.push(this.subscriber.quit());
        }
        if (this.publisher.isReady) {
            Log.stdout('Closing Redis publisher...');
            promises.push(this.publisher.quit());
        }
        return Promise.all(promises).then(() => {
            Log.stdout('Redis connection closed.');
        });
    }
}
//# sourceMappingURL=redis.js.map