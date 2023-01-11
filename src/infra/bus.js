/**@typedef {import('./ibus').Bus} IBus*/
import { EventEmitter } from 'node:events';

/**@implements {IBus}*/
export class Bus {
  #ee;
  #services;
  constructor() {
    this.#ee = new EventEmitter();
    this.#services = new Map();
  }

  subscribe(eventName, handler) {
    this.#ee.on(eventName, handler);
    return true;
  }

  publish(eventName, event) {
    return this.#ee.emit(eventName, event);
  }

  command(commandName, payload) {
    const [serviceName, cmdName] = commandName.split('.');
    const service = this.#services.get(serviceName);
    return service[cmdName]({ metadata, data: payload });
  }

  registerService(name, service) {
    this.#services.set(name, service);
  }
}
