/** @typedef {ReturnType<typeof createClient>} RedisClient */
import { createClient } from 'redis';
import { redis } from './config.js';

export const make = () => {
  const client = createClient({ url: redis.connectionUrl });
  client.on('error', console.error);
  return client;
};

/** @returns {Promise<RedisClient>} */
export const start = async () => {
  if (!redis.connectionUrl) {
    throw new Error('Please set REDIS_URL environment variable');
  };
  const client = make();
  await client.connect();
  return client;
};

/** @type {(cache: RedisClient) => Promise<void>}*/
export const stop = (cache) => cache.disconnect();
