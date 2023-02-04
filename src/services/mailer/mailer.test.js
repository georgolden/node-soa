import assert from 'node:assert';
import { sendEmail } from './mailer.js';

(async () => {
  const email = 'example@example.com';
  const result = await sendEmail({ email });
  assert.strictEqual(result, email);
})();
