import { randomUUID } from 'node:crypto';
import partial from '../../util/partial';

var signup = (dependencies, data) => {
  const { bus, userModel } = dependencies;

  userModel.set(data.username, data);
  bus.publish('signup', { email: data.email });

  const token = randomUUID();
  return { token };
};

var signin = (dependencies, data) => {
  const { bus, userModel } = dependencies;
  const { username, password } = data;
  const user = userModel.get(username);
  if (!user) throw new Error('No user found');
  if (user.password !== password) throw new Error('Invalid password');
  bus.publish('signin', { email: user.email });
  const token = randomUUID();
  return { token };
};

export var commands = { signin, signup };

export var initCommands = (deps) => ({
  signin: partial(signin, deps),
  signup: partial(signup, deps),
});
