/** @typedef {import('metasql').Database} Db */
import metasql from 'metasql';
import { pg as pgConf } from './config.js';

/** @returns {import('./types').Factory<Db>} */
export const factory = () => {
  if (!pgConf.connectionUrl) {
    throw new Error('Please set PG_URL environment variable');
  };
  const connectionString = pgConf.connectionUrl;
  // @ts-ignore
  const instance = new metasql.Database({ connectionString });
  return {
    instance,
    stop: instance.close.bind(instance),
  };
};
