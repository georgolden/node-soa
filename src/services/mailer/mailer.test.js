import assert from 'node:assert';
import { internal } from './mailer.js';

const { generateEmail, sendEmail } = internal;

(async () => {
  const email = 'example@example.com';
  const result = await sendEmail({ email });
  assert.strictEqual(result, email);
})();
