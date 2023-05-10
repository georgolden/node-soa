import * as nodeBus from './nodeBus.js';
import * as redisBus from './redisBus.js';
import * as redisCache from './redisCache.js';
import * as pg from './pg.js';

export const infra = { nodeBus, redisBus, redisCache, pg };

export const getFactories = () => {
  const depFactories = {};
  for (const [name, module] of Object.entries(infra)) {
    depFactories[name] = module.factory;
  }
  return depFactories;
};
