import { initCommands } from './auth/auth.js';
import { initEventHandlers } from './mailer/mailer.js';

export default {
  auth: { initCommands },
  mailer: { initEventHandlers },
};
