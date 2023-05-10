/**
 * @typedef {import('./types').FnSubscribe} FnSubscribe
 * @typedef {import('./types').FnPublish} FnPublish
 * @typedef {import('./types').FnCall} FnCall
 * @typedef {import('./types').FnRegister} FnRegister
 * @typedef {import('./types').IBus} IBus
 * @typedef {import('./types').IPubSub} IPubSub
 * @typedef {import('./types').ICommand} ICommand
*/
import { EventEmitter } from 'node:events';
import { partialObjectLast } from '@oldbros/shiftjs';

/**
 * Implementation of a bus for node js single process
 * @implements {IBus}
 * @implements {IPubSub}
 * @implements {ICommand}
  */
export class NodeBus {
  #ee;
  #services;
  constructor() {
    this.#ee = new EventEmitter();
    this.#services = new Map();
    this.senders = ['publish', 'call'];
    this.subscribe = this.subscribe.bind(this);
    this.publish = this.publish.bind(this);
    this.call = this.call.bind(this);
    this.register = this.register.bind(this);
  }

  /** @type {FnSubscribe} */
  subscribe(eventName, handler) {
    this.#ee.on(eventName, handler);
    return true;
  }

  /** @type {FnPublish} */
  publish(eventName, { meta, data }) {
    return this.#ee.emit(eventName, { meta, data });
  }

  /** @type {FnCall} */
  call(commandName, { meta, data }) {
    const [serviceName, cmdName] = commandName.split('.');
    const service = this.#services.get(serviceName);
    console.dir({ service, cmdName, serviceName });
    return service.commands[cmdName]({ meta, data });
  }

  /** @type {FnRegister} */
  register(name, commands) {
    this.#services.set(name, commands);
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

  stop() {
    this.#services.clear();
    this.#ee.removeAllListeners();
  }
}

/** @returns {import('./types').Factory<NodeBus>} */
export const factory = () => {
  const instance = new NodeBus();
  return {
    instance,
    stop: instance.stop.bind(instance),
  };
};
