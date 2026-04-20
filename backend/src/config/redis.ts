import Redis from 'ioredis';
import { env } from './env';

const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});

let redisUnavailableWarned = false;

redis.on('error', (error) => {
  if (!redisUnavailableWarned) {
    console.warn(`Redis error: ${error.message}`);
  }
});

export async function getRedisClient(): Promise<Redis | null> {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }

    if (redis.status === 'ready') {
      return redis;
    }

    return null;
  } catch (error) {
    if (!redisUnavailableWarned) {
      const message = error instanceof Error ? error.message : 'Unknown redis error';
      console.warn(`Redis unavailable, using in-memory fallback. Details: ${message}`);
      redisUnavailableWarned = true;
    }

    return null;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis.status === 'ready') {
    await redis.quit();
    return;
  }

  if (redis.status === 'wait' || redis.status === 'connecting') {
    await redis.disconnect();
  }
}