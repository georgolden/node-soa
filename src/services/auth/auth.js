/** @typedef {import('./user').User} User */
import { randomUUID } from 'node:crypto';
import { partial } from '@oldbros/shiftjs';

/** @type {(dependencies: object, data: User) => { token: string }} */
const signup = (dependencies, data) => {
  const { bus, db } = dependencies;

  db.userModel.set(data.name, data);
  bus.publish('auth.signup.event', { email: data.email });

  const token = randomUUID();
  return { token };
};

/** @type {(dependencies: object, data: User) => { token: string }} */
const signin = (dependencies, data) => {
  const { bus, db } = dependencies;
  const { name, password } = data;
  const user = db.userModel.get(name);
  if (!user) throw new Error('No user found');
  if (user.password !== password) throw new Error('Invalid password');
  bus.publish('auth.signin.event', { email: user.email });
  const token = randomUUID();
  return { token };
};

export const commands = { signin, signup };

export const initCommands = (deps) => ({
  signin: partial(signin, deps),
  signup: partial(signup, deps),
});
