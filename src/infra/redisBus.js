/**@typedef {import('./.types').FnSubscribe} FnSubscribe*/
/**@typedef {import('./.types').FnPublish} FnPublish*/
/**@typedef {import('./.types').FnCall} FnCall*/
/**@typedef {import('./.types').FnRegister} FnRegister*/
/**@typedef {import('./.types').IBus} IBus*/
/**@typedef {import('./.types').IPubSub} IPubSub*/
/**@typedef {import('./.types').ICommand} ICommand*/
/** @typedef {import('./redis').RedisClient} RedisClient */
import { make } from './redis.js';

const returnError = async (fn, ...args) => {
  let err = null;
  let res = null;
  try {
    res = await fn(...args);
  } catch (error) {
    err = error;
  }
  return [err, res];
};

/**
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
  #subClient = make();
  /** @type {RedisClient}*/
  #cmdClient = make();
  constructor() {
    this.#calls;
    this.#callId;
    this.#subClient;
    this.#cmdClient;
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

  async publish(eventName, event) {
    if (!this.#publishedOnce) {
      await this.waitPubSub();
      this.#publishedOnce = true;
    }
    const json = JSON.stringify(event);
    return this.#cmdClient.publish(eventName, json);
  }

  subscribe(eventName, handler) {
    const rawHandler = (raw) => handler(JSON.parse(raw));
    return this.#subClient.subscribe(eventName, rawHandler);
  }

  unsubscribe(...eventNames) {
    return this.#subClient.unsubscribe(...eventNames);
  }

  async call(commandName, payload) {
    const [service, cmd] = commandName.split('.');
    if (this.#callId === Number.MAX_VALUE) this.#callId = 0;
    const callId = this.#callId++;
    const { data, metadata } = payload;
    const requestKey = `${service}:${cmd}:request`;
    const raw = JSON.stringify({ data, metadata, callId });
    await this.#cmdClient.publish(requestKey, raw);
    return new Promise((resolve, reject) => {
      this.#calls.set(callId, [resolve, reject]);
    });
  }

  async register(name, commands) {
    for (const [cmd, handler] of Object.entries(commands)) {
      const reqKey = `${name}:${cmd}:request`;
      const resKey = `${name}:${cmd}:response`;
      await this.#subClient.subscribe(resKey, (msg) => {
        const { response: [err, res], callId } = JSON.parse(msg);
        const [resolve, reject] = this.#calls.get(callId);
        if (err) reject(err);
        else resolve(res);
      });
      await this.#subClient.subscribe(reqKey, async (msg) => {
        const { data, metadata, callId } = JSON.parse(msg);
        const response = await returnError(handler, { data, metadata });
        const packet = JSON.stringify({ response, callId });
        await this.#cmdClient.publish(resKey, packet);
      });
    }
    return this.waitPubSub();
  }

  async waitPubSub() {
    const w8Key = 'system:waitPubSub';
    await new Promise(async (resolve, _reject) => {
      await this.#subClient.subscribe(w8Key, (msg) => resolve(msg));
      await this.#cmdClient.publish(w8Key, 'true');
    });
    return this.#subClient.unsubscribe(w8Key);
  }
}
