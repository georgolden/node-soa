/** @typedef {import('../types').Db} Db */
/** @typedef {import('../types').User} User */
/**
 * @param {Db} db
 * @param {User} user
 * @returns {Promise<string>}
 * */
const insert = async (db, user) => {
  // @ts-ignore
  const { rows: [{ id }] } = await db.insert(
    'User',
    user,
  ).returning('id');
  return id;
};

/**
 * @param {Db} db
 * @param {string} id
 * @returns {Promise<User>}
 */
const selectById = (db, id) =>
  // @ts-ignore
  db.row('User', { id });

/**
 * @param {Db} db
 * @param {string} email
 * @returns {Promise<User>}
 */
const selectByEmail = (db, email) =>
  // @ts-ignore
  db.row('User', { email });

export const user = { insert, selectById, selectByEmail };
