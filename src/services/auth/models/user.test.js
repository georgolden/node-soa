import test from 'node:test';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { start, stop } from '../../../infra/pg.js';
import { user } from './user.js';

const db = await start();
let userId;

await test('User model with postgres', async () => {
  const bob = {
    name: 'Bob',
    password: randomUUID(),
    birthDate: new Date('1992-02-02'),
    age: 25,
    email: 'bobib@bobs.bob',
    phoneCode: '+356',
    phoneNumber: '123123123123123',
    country: 'Argentina',
  };

  userId = await user.insert(db, bob);
  assert(userId);
  const gotByEmail = await user.selectByEmail(db, bob.email);
  const gotById = await user.selectById(db, userId);
  assert.deepStrictEqual(gotByEmail, gotById);
  assert.deepStrictEqual({
    ...gotByEmail,
    birthDate: new Date('1992-02-02'),
  }, { id: userId, ...bob });
}).finally(async () => {
  await db.delete('User', { id: userId });
  await stop(db);
});
