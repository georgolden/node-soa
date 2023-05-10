/**
 * @typedef {import('./types').AnyFunc} AnyFunc
 * @typedef {import('./types').IPayload} IPayload
 * @typedef {import('./types').AnyServiceCommands} AnyServiceCommands
 * @typedef {import('./types').AnyEventHandler} AnyEventHandler
 * @typedef {import('./types').FnCall} FnCall
 * @typedef {import('./types').IBus} IBus
 * @typedef {import('./types').IPubSub} IPubSub
 * @typedef {import('./types').ICommand} ICommand
 *  @typedef {import('./redisCache').RedisClient} RedisClient
*/
import { partialObjectLast } from '@oldbros/shiftjs';
import { create } from './redisCache.js';

const returnError = (fn, ...args) => new Promise((resolve) => {
  fn(...args)
    .catch((err) => resolve([err, null]))
    .then((res) => resolve([null, res]));
});

/**
 * Implementation of a bus with PubSub and Command
 * using redis and redis publish subscribe
 * @implements {IBus}
 * @implements {IPubSub}
 * @implements {ICommand}
*/
export class RedisBus {
  #publishedOnce = false;
  #calls = new Map();
  /** @type {number} */
  #callId = 0;
  /** @type {RedisClient}*/
  #subClient = create();
  /** @type {RedisClient}*/
  #cmdClient = create();
  constructor() {
    this.#calls;
    this.#callId;
    this.#subClient;
    this.#cmdClient;
    this.senders = ['publish', 'call'];
    this.subscribe = this.subscribe.bind(this);
    this.publish = this.publish.bind(this);
    this.call = this.call.bind(this);
    this.register = this.register.bind(this);
  }

  async connect() {
    return Promise.all([
      this.#cmdClient.connect(),
      this.#subClient.connect(),
    ]);
  }

  async disconnect() {
    this.#subClient.unsubscribe('*');
    return Promise.all([
      this.#cmdClient.disconnect(),
      this.#subClient.disconnect(),
    ]);
  }

  /**
   * @param {string} eventName
   * @param {object} event
   * @returns {Promise<number>}
  */
  async publish(eventName, event) {
    if (!this.#publishedOnce) {
      await this.pingPubSub();
      this.#publishedOnce = true;
    }
    const json = JSON.stringify(event);
    return this.#cmdClient.publish(eventName, json);
  }

  /**
   * @param {string} eventName
   * @param {AnyEventHandler} handler
   * @returns {Promise<void>}
  */
  subscribe(eventName, handler) {
    const rawHandler = (raw) => handler(JSON.parse(raw));
    return this.#subClient.subscribe(eventName, rawHandler);
  }

  /** @type {(...eventNames: string[]) => Promise<void>} */
  unsubscribe(...eventNames) {
    return this.#subClient.unsubscribe(...eventNames);
  }

  /**
   * @param {string} commandName
   * @param {IPayload} payload
   * @returns {Promise<object>}
  */
  async call(commandName, payload) {
    const [service, cmd] = commandName.split('.');
    if (this.#callId === Number.MAX_VALUE) this.#callId = 0;
    const callId = this.#callId++;
    const { data, meta } = payload;
    const requestKey = `${service}:${cmd}:request`;
    const raw = JSON.stringify({ data, meta, callId });
    await this.#cmdClient.publish(requestKey, raw);
    return new Promise((resolve, reject) => {
      this.#calls.set(callId, [resolve, reject]);
    });
  }

  /**
   * @param {string} name
   * @param {AnyServiceCommands} commands
   * @returns {Promise<void>}
  */
  async register(name, commands) {
    for (const [cmd, handler] of Object.entries(commands)) {
      const reqKey = `${name}:${cmd}:request`;
      const resKey = `${name}:${cmd}:response`;
      await this.#listenToResponce(resKey);
      await this.#listenToRequest(reqKey, resKey, handler);
    }
    return this.pingPubSub();
  }

  /** @param {string} resKey */
  #listenToResponce(resKey) {
    return this.#subClient.subscribe(resKey, (msg) => {
      const { response: [err, res], callId } = JSON.parse(msg);
      const [resolve, reject] = this.#calls.get(callId);
      if (err) reject(err);
      else resolve(res);
    });
  }

  /**
   * @param {string} reqKey
   * @param {string} resKey
   * @param {AnyFunc} handler
  */
  #listenToRequest(reqKey, resKey, handler) {
    return this.#subClient.subscribe(reqKey, async (msg) => {
      const { data, meta, callId } = JSON.parse(msg);
      const response = await returnError(handler, { data, meta });
      const packet = JSON.stringify({ response, callId });
      await this.#cmdClient.publish(resKey, packet);
    });
  }

  async pingPubSub() {
    const w8Key = 'system:pingPubSub';
    await new Promise((resolve, reject) => {
      this.#subClient.subscribe(w8Key, (msg) => resolve(msg))
        .catch(reject)
        .then(() =>
          this.#cmdClient.publish(w8Key, 'true')
            .catch(reject),
        );
    });
    return this.#subClient.unsubscribe(w8Key);
  }

  /** @type {(meta: object) => this} */
  withMeta(meta) {
    return new Proxy(this, {
      get(target, prop) {
        const method = target[prop];
        if (typeof prop === 'string' && target.senders.includes(prop)) {
          return partialObjectLast(method, { meta });
        } else {
          return method;
        }
      },
    });
  }
}

/** @returns {import('./types').Factory<RedisBus>} */
export const factory = () => {
  const instance = new RedisBus();
  return {
    start: instance.connect.bind(instance),
    instance,
    stop: instance.disconnect.bind(instance),
  };
};
