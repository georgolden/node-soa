import test from 'node:test';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import {
  validatePass,
  validateToken,
  generateToken,
  hashPassword,
} from './crypto.js';

test('Crypto utilities for auth service', async () => {
  const password = randomUUID();
  const hash = await hashPassword(password);
  const token = generateToken(hash);
  const tokenValid = validateToken(hash, token);
  assert.strictEqual(tokenValid, true);
  const passValid = await validatePass(password, hash);
  assert.strictEqual(passValid, true);
});
