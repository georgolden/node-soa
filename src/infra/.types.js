/** @typedef {(...args: any[]) => any} AnyFunc */

/** @typedef {(event: object) => any} AnyEventHandler*/

/** @typedef {{[key: string]: AnyFunc}} AnyServiceCommands */

/**
 * @typedef {Object} ServiceMetadata
 * @property {string[]} dependencies
 */

/**
 * Interface for Service to be applicable with infrastructure
 * Each service must return this form init handler
 * @typedef {Object} IService
 * @property {string} name
 * @property {AnyServiceCommands | null} commands
 * @property {{[key: string]: AnyFunc} | null} eventHandlers
 * @property {ServiceMetadata} metadata
 */

/**
 * @callback FnSubscribe
 * @param {string} eventName
 * @param {AnyEventHandler} handler
 * @returns {boolean}
 */

/**
 * @callback FnPublish
 * @param {string} eventName
 * @param {object} event
 */

/**
 * Interface for PubSub pattern
 * Contains subcribe and publish functions
 * @typedef {Object} IPubSub
 * @property {FnSubscribe} subscribe
 * @property {FnPublish} publish
 */

/**
 * @callback FnCall
 * @param {string} commandName
 * @param {object} payload
 * @returns {Promise<any>}
 */

/**
 * @callback FnRegister
 * @param {string} serviceName
 * @param {AnyServiceCommands} commands
 */

/**
 * Interface for a CommandPattern
 * Contains call and register functions
 * @typedef {Object} ICommand
 * @property {FnCall} call
 * @property {FnRegister} register
 */

/**
 * Bus instance must implement 
 * at least on of PubSub, Command
 * or EventStreams communication patterns
 * @typedef {Object} IBus
 */

export default {};
