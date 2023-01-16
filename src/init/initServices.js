import services from '../services/services.js';
import { Bus } from '../infra/bus.js';

export const initServices = () => {
  const bus = new Bus();
  const db = {
    userModel: new Map(),
  };

  const deps = { bus, db };

  for (const [serviceName, inits] of Object.entries(services)) {
    const { initCommands = null, initEventHandlers = null } = inits;
    if (initCommands) {
      const commands = initCommands(deps);
      bus.registerService(serviceName, commands);
    }
    if (initEventHandlers) {
      const eventHandlers = initEventHandlers(deps);
      for (const [eventName, handler] of Object.entries(eventHandlers)) {
        bus.subscribe(eventName, handler);
      }
    }
  }

  return { bus };
};
