import services from '../services/services.js';
import { Bus } from '../infra/bus.js';

export const initServices = () => {
  const bus = new Bus();

  for (const [name, ServiceConstructor] of Object.entries(services)) {
    const service = new ServiceConstructor({ bus });
    bus.registerService(name, service);
  }

  return { bus };
};
