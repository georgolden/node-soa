import test from 'node:test';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { start, stop } from '../../../infra/redis.js';
import { session } from './session.js';

const cache = await start();

await test('Session model with redis client', async () => {
  const token = randomUUID();
  const givenUserId = randomUUID();
  await session.start(cache, token, givenUserId);
  const gotUserId = await session.read(cache, token);
  assert.strictEqual(givenUserId, gotUserId);
  await session.del(cache, token);
  const notFound = await session.read(cache, token);
  assert.strictEqual(notFound, null);
});

await stop(cache);
