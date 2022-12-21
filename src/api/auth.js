/**@typedef {import('./router').HttpRoute} HttpRoute */

/**@type {HttpRoute} */
const signup = {
  method: 'POST',
  url: '/signup',
  command: 'auth.signup',
  dataSource: 'JSONBody',
};

/**@type {HttpRoute} */
const signin = {
  method: 'POST',
  url: '/signin',
  command: 'auth.signin',
  dataSource: 'JSONBody',
};

/**@type {HttpRoute} */
const refresh = {
  method: 'POST',
  url: '/refresh',
  command: 'auth.refresh',
  dataSource: 'JSONBody',
};

/**@type {HttpRoute} */
const signout = {
  method: 'POST',
  url: '/signout',
  command: 'auth.signout',
  dataSource: 'JSONBody',
};

export default [signup, signin, refresh, signout];
