import Redis from 'ioredis'
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
}

const redis = new Redis(config)

export const cacheService = {
    async get(key: string) {
        const data = await redis.get(key)
        return data ? JSON.parse(data) : null
    },

    async set(key: string, value: any, expireInSeconds = 3600) {
        await redis.set(key, JSON.stringify(value), 'EX', expireInSeconds)
    },

    async del(key: string) {
        await redis.del(key)
    },

    async keys(pattern: string) {
        return await redis.keys(pattern)
    }
}