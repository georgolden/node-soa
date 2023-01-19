/** @typedef {import('../.types').Redis} Cache */
import conf from './session.config.js';

/** @type {(cache: Cache, token: string, userId: string) => Promise<string>} */
const start = (cache, token, userId) =>
  cache.setEx(token, conf.expire, userId);

/** @type {(cache: Cache, token: string) => Promise<string | null>} */
const read = (cache, token) =>
  cache.get(token);

/** @type {(cache: Cache, token: string) => Promise<number>} */
const del = (cache, token) =>
  cache.del(token);

export const session = { start, read, del };
