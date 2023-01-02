import assert from 'node:assert';
import { AuthService } from './auth.js';
import { Bus } from '../../infra/bus.js';

const bus = new Bus();

const auth = new AuthService({ bus });

(async () => {
  const user = {
    username: 'John',
    password: 'my password',
    email: 'john@example.com',
  };
  await auth.signup(user);
  const { token } = await auth.signin(user);
  assert.strictEqual(typeof token, 'string');
})();
