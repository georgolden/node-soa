/** @typedef {import('../../infra/redis').RedisClient} Redis */
/** @typedef {import('../../infra/pg').Db} Db */
/** @typedef {import('../../infra/bus').Bus} Bus */

/**
 * @typedef Dependencies
 * @property {Bus} bus
 * @property {Redis} cache
 * @property {Db} db
 * */

/**
 * @typedef {Object} User
 * @property {string} [id]
 * @property {string} name
 * @property {string} password
 * @property {Date} birthDate
 * @property {number} age
 * @property {string} email
 * @property {string} phoneCode
 * @property {string} phoneNumber
 * @property {string} country
 */

export default {};
