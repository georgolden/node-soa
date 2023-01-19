import serviceDeclarations from '../services/services.js';
import { Bus } from '../infra/bus.js';
import * as postgres from '../infra/pg.js';
import * as redis from '../infra/redis.js';

console.log(serviceDeclarations);

export const initServices = async () => {
  const db = await postgres.start();
  const cache = await redis.start();
  const bus = new Bus();
  const allDeps = { bus, cache, db };
  for (const { metadata, init } of serviceDeclarations) {
    /** @type {any} */
    const deps = {};
    for (const dep of metadata.dependencies) {
      deps[dep] = allDeps[dep];
    }
    const service = init(deps);
    const { commands, eventHandlers } = service;
    if (commands) {
      bus.register(metadata.name, commands);
    }
    if (eventHandlers) {
      for (const [eventName, handler] of Object.entries(eventHandlers)) {
        bus.subscribe(eventName, handler);
      }
    }
  }

  return { bus };
};
