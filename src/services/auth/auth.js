import { randomUUID } from 'node:crypto';

export default class AuthService {
  constructor({ bus }) {
    this.bus = bus;
    this.users = new Map();
  }

  // this is a command
  async signin({ username, password }) {
    const user = this.users.get(username);
    if (!user) return new Error('No user found');
    if (user.password !== password) return new Error('Invalid password');
    this.bus.publish('signin', { email: user.email });
    const token = randomUUID();
    return token;
  }

  // this is a command
  async signup(user) {
    this.users.set(user.name, user);
    this.bus.publish('signup', { email: user.email });
    const token = randomUUID();
    return token;
  }
}
