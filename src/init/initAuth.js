import partial from '../util/partial.js';
import { signup } from '../services/auth/auth.js';
import { Bus } from '../infra/bus.js';

const bus = new Bus();

const userModel = new Map();

const dependencies = { bus, userModel };

const apiMethodSignup = partial(signup, dependencies);

const res = apiMethodSignup({ username: 'user', password: 'password' });

console.log(res);
