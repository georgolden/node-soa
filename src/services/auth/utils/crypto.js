import conf from '../models/session.config.js';
import metautil from 'metautil';

/** @type {(hash: string) => string} */
export const generateToken = (hash) => {
  const { characters, length } = conf;
  return metautil.generateToken(hash, characters, length);
};

/** @type {(hash: string, token: string) => boolean} */
export const validateToken = (hash, token) =>
  metautil.validateToken(hash, token);


/** @type {(password: string) => Promise<string>} */
export const hashPassword = (password) =>
  metautil.hashPassword(password);

/** @type {(password: string, hash: string) => Promise<boolean>} */
export const validatePass = (password, hash) =>
  metautil.validatePassword(password, hash);
