/** @typedef {import('../../infra/.types').IService} IService */
/** @typedef {import('../../infra/.types').ServiceMetadata} ServiceMetadata */
/** @typedef {import('./.types').Dependencies} Deps */
/** @typedef {import('./.types').User} User */
import { partial } from '@oldbros/shiftjs';
import { signin, signup, validate } from './auth.js';

/**
 * @callback SigninCmd
 * @param {{data: { email: string, password: string }}} payload
 * @returns {Promise<{ token: string }>}
 */

/**
 * @callback SignupCmd
 * @param {{data: User}} payload
 * @returns {Promise<void>}
 */

/**
 * @callback ValidateCmd
 * @param {{data: { token: string }}} payload
 * @returns {Promise<{ valid: boolean}>}
 */

/**
 * @typedef Commands
 * @property {SigninCmd} signin
 * @property {SignupCmd} signup
 * @property {ValidateCmd} validate
 */

/**
 * @typedef {Object} AuthService
 * @property {Commands} commands
 * @property {null} eventHandlers
 */

/**
 * @param {Deps} deps
 * @returns {AuthService}
 */
export const init = (deps) => ({
  commands: {
    signin: partial(signin, deps),
    signup: partial(signup, deps),
    validate: partial(validate, deps),
  },
  eventHandlers: null,
});

/** @type {ServiceMetadata} */
export const metadata = {
  name: 'auth',
  dependencies: ['db', 'cache', 'bus'],
};
