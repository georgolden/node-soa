/**
 * @typedef {import('../../dfs/types').ServiceConfig} ServiceConfig
 * @typedef {import('./types').Dependencies} Deps
 * @typedef {import('./types').User} User
 * @typedef {import('./types').AuthService} AuthService
*/
import { signin, signup, validate } from './auth.js';
import { createDomainService } from '../../dfs/domainFunction.js';

/** @type {ServiceConfig} */
export const config = {
  hideMeta: true,
  scope: 'local',
  name: 'auth',
  dependencies: [
    // token in service --- token in infra
    ['db', 'pg'],
    ['cache', 'redisCache'],
    ['bus', 'nodeBus'],
  ],
};

/**
 * @param {Deps} deps
 * @returns {AuthService}
*/
export const factory = (deps) =>
  createDomainService(
    [
      // commands
      { signin, signup, validate },
      // eventHandlers
      null,
    ],
    deps,
    config,
  );
