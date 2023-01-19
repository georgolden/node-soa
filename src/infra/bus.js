/**@typedef {import('./.types').FnSubscribe} FnSubscribe*/
/**@typedef {import('./.types').FnPublish} FnPublish*/
/**@typedef {import('./.types').FnCall} FnCall*/
/**@typedef {import('./.types').FnRegister} FnRegister*/
/**@typedef {import('./.types').IBus} IBus*/
/**@typedef {import('./.types').IPubSub} IPubSub*/
/**@typedef {import('./.types').ICommand} ICommand*/
import { EventEmitter } from 'node:events';

/**
  * @implements {IBus}
  * @implements {IPubSub}
  * @implements {ICommand}
  */
export class Bus {
  #ee;
  #services;
  constructor() {
    this.#ee = new EventEmitter();
    this.#services = new Map();
  }

  /** @type {FnSubscribe} */
  subscribe(eventName, handler) {
    this.#ee.on(eventName, handler);
    return true;
  }

  /** @type {FnPublish} */
  publish(eventName, event) {
    return this.#ee.emit(eventName, event);
  }

  /** @type {FnCall} */
  call(commandName, payload) {
    const [serviceName, cmdName] = commandName.split('.');
    const service = this.#services.get(serviceName);
    return service[cmdName](payload);
  }

  /** @type {FnRegister} */
  register(name, service) {
    this.#services.set(name, service);
  }
}
