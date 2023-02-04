/**
 * @typedef {import('../../dfs/types').ServiceMetadata} ServiceMetadata
 * @typedef {import('../../dfs/types').ServiceConfig} ServiceConfig
 * @typedef {import('./types').Dependencies} Deps
 * @typedef {import('./types').User} User
 * @typedef {import('./types').AuthService} AuthService
*/
import { createDomainFunction } from '../../dfs/domainFunction.js';
import { signin, signup, validate } from './auth.js';

/** @type {ServiceConfig} */
export const config = {
  hideMeta: true,
  scope: 'local',
};

/** @type {ServiceMetadata} */
export const metadata = {
  name: 'auth',
  dependencies: ['db', 'cache', ['bus', 'nodeBus']],
};

/**
 * @param {Deps} deps
 * @returns {AuthService}
 */
export const init = (deps) => ({
  commands: {
    signin: createDomainFunction(signin, deps, config),
    signup: createDomainFunction(signup, deps, config),
    validate: createDomainFunction(validate, deps, config),
  },
  eventHandlers: null,
});
