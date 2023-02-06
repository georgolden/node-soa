import { pipe, partial } from '@oldbros/shiftjs';
import { NodeBus } from '../../infra/nodeBus.js';
import * as postgres from '../../infra/pg.js';
import * as redis from '../../infra/redisCache.js';

import { signin, signup, validate } from './auth.js';
import { metadata } from './auth.service.js/index.js';

const db = await postgres.start();
const cache = await redis.start();

const bus = new Proxy(new NodeBus(), {
  get(bus, prop) {
    const originMethod = bus[prop];
    if (prop === 'publish') {
      console.log('PUBLISHED');
      return originMethod;
    } else if (prop === 'call') {
      return (eventName, payload) => {
        payload.meta = { isaac: 'cock' };
        return originMethod(eventName, payload);
      };
    } else {
      return originMethod;
    }
  },
});

const deps = { bus, cache, db };

const imperify = (asyncFn) =>
  (...args) => new Promise((resolve) => {
    asyncFn(...args)
      .catch((err) => resolve([err, null]))
      .then((res) => resolve([null, res]));
  });

const bob = {
  name: 'Bob',
  password: 'this is password',
  birthDate: new Date('1992-02-02'),
  age: 25,
  email: 'bobib@bobs.bob',
  phoneCode: '+356',
  phoneNumber: '123123123123123',
  country: 'Argentina',
};

const wrapDepWithMeta = (dep, methodName, ...args) =>
  (meta) => {
    let last = args.pop();
    last = last.meta ? last : { ...last, meta };
    const newArgs = [...args, last];
    return dep[methodName](...newArgs);
  };

const trueSignin = imperify(partial(signin, deps));
bus.register('auth', { signin: trueSignin });
const payload = { data: { email: bob.email, password: bob.password } };
const [_, result] = await bus.call('auth.signin', payload);

await Promise.all([
  cache.del(result.token),
]);

await Promise.all([
  postgres.stop(db),
  redis.stop(cache),
]);
