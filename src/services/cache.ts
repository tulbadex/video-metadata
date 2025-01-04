import Redis from 'ioredis'
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
}

const redis = process.env.NODE_ENV === 'test' 
  ? new Redis({ ...config, lazyConnect: true })
  : new Redis(config);

export const cacheService = {
    async get(key: string) {
        if (process.env.NODE_ENV === 'test') return null;
        const data = await redis.get(key)
        return data ? JSON.parse(data) : null
    },

    async set(key: string, value: any, expireInSeconds = 3600) {
        if (process.env.NODE_ENV === 'test') return;
        await redis.set(key, JSON.stringify(value), 'EX', expireInSeconds)
    },

    async del(key: string) {
        if (process.env.NODE_ENV === 'test') return;
        await redis.del(key)
    },

    async keys(pattern: string) {
        if (process.env.NODE_ENV === 'test') return [];
        return await redis.keys(pattern)
    },

    async disconnect() {
        await redis.quit();
    }
}