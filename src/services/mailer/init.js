/** @typedef {import('../../infra/.types').IService} IService */
/** @typedef {import('../../infra/.types').ServiceMetadata} ServiceMetadata */
import { partial } from '@oldbros/shiftjs';
import { signinEventHandler, signupEventHandler } from './mailer.js';

/** @type {(deps: any) => IService} */
export const init = (deps) => ({
  commands: null,
  eventHandlers: {
    'auth.signin.event': partial(signinEventHandler, deps),
    'auth.signup.event': partial(signupEventHandler, deps),
  },
});

/** @type {ServiceMetadata} */
export const metadata = {
  name: 'mailer',
  dependencies: ['nodeBus'],
};
