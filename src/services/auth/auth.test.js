import assert from 'node:assert';
import { initCommands, commands } from './auth.js';
import { Bus } from '../../infra/bus.js';

const dependencies = { bus: new Bus(), userModel: new Map() };
const { signin, signup } = initCommands(dependencies);

(async () => {
  const user = {
    username: 'John',
    password: 'my password',
    email: 'john@example.com',
  };
  signup(user);
  const { token } = signin(user);
  assert.strictEqual(typeof token, 'string');
})();

(async () => {
  const user = {
    username: 'John',
    password: 'my password',
    email: 'john@example.com',
  };
  commands.signup(dependencies, user);
  const { token } = commands.signin(dependencies, user);
  assert.strictEqual(typeof token, 'string');
})();
