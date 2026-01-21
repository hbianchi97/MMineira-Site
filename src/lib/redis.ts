import { Redis } from "@upstash/redis";

/**
 * Redis client for caching.
 * Uses Upstash Redis which is perfect for serverless environments.
 */
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Cache helper to simplify get/set operations with automatic JSON parsing
 */
export const cache = {
    async get<T>(key: string): Promise<T | null> {
        if (!process.env.UPSTASH_REDIS_REST_URL) return null;
        try {
            return await redis.get<T>(key);
        } catch (error) {
            console.error(`[Redis] Get error for key ${key}:`, error);
            return null;
        }
    },

    async set(key: string, value: any, seconds: number = 3600): Promise<void> {
        if (!process.env.UPSTASH_REDIS_REST_URL) return;
        try {
            await redis.set(key, value, { ex: seconds });
        } catch (error) {
            console.error(`[Redis] Set error for key ${key}:`, error);
        }
    },

    async del(key: string): Promise<void> {
        if (!process.env.UPSTASH_REDIS_REST_URL) return;
        try {
            await redis.del(key);
        } catch (error) {
            console.error(`[Redis] Delete error for key ${key}:`, error);
        }
    },

    /**
     * Delete multiple keys by pattern (simulated via scan or by prefix)
     * For catalog, we usually want to clear all product-related cache
     */
    async clearByPrefix(prefix: string): Promise<void> {
        if (!process.env.UPSTASH_REDIS_REST_URL) return;
        try {
            // Upstash supports scan and multi-del
            let cursor = 0;
            do {
                const [nextCursor, keys] = await redis.scan(cursor, { match: `${prefix}*`, count: 100 });
                if (keys.length > 0) {
                    await redis.del(...keys);
                }
                cursor = Number(nextCursor);
            } while (cursor !== 0);
        } catch (error) {
            console.error(`[Redis] ClearByPrefix error for prefix ${prefix}:`, error);
        }
    }
};
