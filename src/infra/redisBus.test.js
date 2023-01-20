import { RedisBus } from './redisBus.js';
import test from 'node:test';
import assert from 'node:assert';

const redisPubSub = new RedisBus();

await test('Redis bus pub/sub', async () => {
  await redisPubSub.connect();
  const arr = [];
  const eevs = {
    mom: (msg) => {
      assert(`Mom of ${msg}`);
      arr.push(`Mom of ${msg}`);
    },
    dad: (msg) => {
      assert(`Dad of ${msg}`);
      arr.push(`Dad of ${msg}`);
    },
  };
  const subs = [];
  for (const [name, handler] of Object.entries(eevs)) {
    await redisPubSub.subscribe(name, handler);
  };
  await Promise.all(subs);
  await Promise.all([
    redisPubSub.publish('mom', 'Tony'),
    redisPubSub.publish('mom', 'Bob'),
    redisPubSub.publish('dad', 'Paul'),
    redisPubSub.publish('mom', 'John'),
  ]);
  await redisPubSub.pingPubSub();
  assert.strictEqual(arr.length, 4);
}).finally(async () => {
  await redisPubSub.disconnect();
});

const redisCommand = new RedisBus();

await test('Redis bus command', async () => {
  await redisCommand.connect();

  const serviceName = 'greet';
  const commands = {
    hiMom: ({ data }) => 'Hi mom ' + data,
    hiDad: ({ data }) => 'Hi dad ' + data,
  };
  await redisCommand.register(serviceName, commands);

  const hiMomSent = { data: 'I am back home', metadata: null };
  const hiMomGreet = await redisCommand.call('greet.hiMom', hiMomSent);
  await redisCommand.pingPubSub();
  assert.strictEqual('Hi mom ' + hiMomSent.data, hiMomGreet);

  const hiDadSent = { data: 'Can I borrow your car?', metadata: null };
  const hiDadGreet = await redisCommand.call('greet.hiDad', hiDadSent);
  await redisCommand.pingPubSub();
  assert.strictEqual('Hi dad ' + hiDadSent.data, hiDadGreet);
}).finally(async () => {
  await redisCommand.disconnect();
});
