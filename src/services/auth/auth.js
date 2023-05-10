/**
 * @typedef {import('./types').Dependencies} Deps
 * @typedef {import('./types').User} User
 * @typedef {import('./types').SigninPayload} SigninPayload
*/
import { user } from './models/user.js';
import { session } from './models/session.js';
import {
  hashPassword, generateToken,
  validatePass, validateToken,
} from './utils/crypto.js';

/**
 * @param {Deps} deps
 * @param {{data: User, meta?: object}} payload
 * @returns {Promise<void>}
 */
export const signup = async (deps, { data }) => {
  const { bus, db } = deps;
  const hash = await hashPassword(data.password);
  await user.insert(db, { ...data, password: hash });
  bus.publish('auth.signup.event', { data: { email: data.email } });
};

/**
 * @param {Deps} deps
 * @param {SigninPayload} payload
 * @returns {Promise<{ token: string }>}
 */
export const signin = async (deps, { data }) => {
  const { bus, db, cache } = deps;
  const { email, password } = data;
  const userData = await user.selectByEmail(db, email);
  if (!userData || !userData.id) throw new Error('No user found');
  const { id, password: hash } = userData;
  const valid = await validatePass(password, hash);
  if (!valid) throw new Error('Invalid password');
  const token = generateToken(id);
  await session.start(cache, token, `${id}:${email}`);
  bus.publish('auth.signin.event', { data: userData });
  return { token };
};

/**
 * @param {Deps} deps
 * @param {{data: { token: string }}} payload
 * @returns {Promise<{valid: boolean}>}
 */
export const validate = async (deps, { data }) => {
  const { cache } = deps;
  const { token } = data;
  const sessionId = await session.read(cache, token);
  if (!sessionId) throw new Error('Token expired');
  const [userId] = sessionId.split(':');
  const valid = validateToken(userId, token);
  return { valid };
};
