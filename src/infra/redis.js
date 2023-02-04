/** @typedef {ReturnType<typeof createClient>} RedisClient */
import { createClient } from 'redis';
import { redis } from './config.js';

export const create = () => {
  const client = createClient({ url: redis.connectionUrl });
  client.on('error', console.error);
  return client;
};

/** @returns {import('./types').Factory<RedisClient>} */
export const factory = () => {
  if (!redis.connectionUrl) {
    throw new Error('Please set REDIS_URL environment variable');
  }
  const instance = create();
  return {
    start: instance.connect.bind(instance),
    instance,
    stop: instance.disconnect.bind(instance),
  };
};
