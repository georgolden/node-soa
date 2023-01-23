import serviceDeclarations from '../services/services.js';
import { createNodeBus } from '../infra/nodeBus.js';
import { createRedisBus } from '../infra/redisBus.js';
import * as postgres from '../infra/pg.js';
import * as redis from '../infra/redis.js';

export const initServices = async () => {
  const db = await postgres.start();
  const cache = await redis.start();
  const nodeBus = await createNodeBus();
  const redisBus = await createRedisBus();
  const allDeps = { nodeBus, redisBus, cache, db };
  for (const { metadata, init } of serviceDeclarations) {
    /** @type {any} */
    const deps = {};
    for (const dep of metadata.dependencies) {
      if (dep.endsWith('Bus')) {
        deps.bus = allDeps[dep];
      } else {
        deps[dep] = allDeps[dep];
      }
    };
    const service = init(deps);
    const { commands, eventHandlers } = service;
    if (commands) {
      deps.bus.register(metadata.name, commands);
    }
    if (eventHandlers) {
      for (const [eventName, handler] of Object.entries(eventHandlers)) {
        deps.bus.subscribe(eventName, handler);
      }
    }
  }

  return allDeps;
};
