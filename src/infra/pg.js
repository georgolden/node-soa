/** @typedef {import('metasql').Database} Db */
import metasql from 'metasql';
import { pg as pgConf } from './config.js';

/** @returns {Promise<Db>} */
export const start = async () => {
  if (!pgConf.connectionUrl) {
    throw new Error('Please set PG_URL environment variable');
  };
  // @ts-ignore
  return new metasql.Database({ connectionString: pgConf.connectionUrl });
};

/** @type {(db: Db) => Promise<void>} */
export const stop = async (db) => db.close();
