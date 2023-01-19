import { Bus } from '../../infra/bus.js';
import * as postgres from '../../infra/pg.js';
import * as redis from '../../infra/redis.js';
import test from 'node:test';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';

import { init } from './init.js';

const db = await postgres.start();
const cache = await redis.start();
const bus = new Bus();

const deps = { bus, cache, db };

const bob = {
  name: 'Bob',
  password: randomUUID(),
  birthDate: new Date('1992-02-02'),
  age: 25,
  email: 'bobib@bobs.bob',
  phoneCode: '+356',
  phoneNumber: '123123123123123',
  country: 'Argentina',
};

let cleanCache;

await test('Signup, signin then validate', async () => {
  const authService = init(deps);
  await authService.commands.signup({ data: bob });
  const data = { email: bob.email, password: bob.password };
  const { token } = await authService.commands.signin({ data });
  const { valid } = await authService.commands.validate({ data: { token } });
  assert.strictEqual(valid, true);
  cleanCache = token;
}).finally(async () => {
  await Promise.all([
    db.delete('User', { email: bob.email }),
    cache.del(cleanCache),
  ]);
  await Promise.all([
    postgres.stop(db),
    redis.stop(cache),
  ]);
});
