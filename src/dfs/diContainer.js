export class DiContainer {
  instances = {};
  starts = [];
  stops = [];
  services = new Map();

  constructor(depFactories) {
    for (const [name, factory] of Object.entries(depFactories)) {
      const dep = factory();
      if (dep.start) this.starts.push(dep.start);
      if (dep.stop) this.stops.push(dep.stop);
      this.instances[name] = dep.instance;
    }
  }

  init() {
    return this.starts.map((fn) => fn());
  }

  shutdown() {
    return this.stops.map((fn) => fn());
  }

  async addService(serviceFactory, config) {
    const { dependencies } = config;
    const serviceContainer = {};
    for (const dep of dependencies) {
      if (typeof dep !== 'string') {
        const [serviceToken, infraToken] = dep;
        if (!this.instances[infraToken]) {
          throw new ReferenceError(
            `Dependency ${dep} required by service ${config.name} not found`,
          );
        }
        serviceContainer[serviceToken] = this.instances[infraToken];
      } else {
        if (!this.instances[dep]) {
          throw new ReferenceError(
            `Dependency ${dep} required by service ${config.name} not found`,
          );
        }
        serviceContainer[dep] = this.instances.get(dep);
      }
    }
    const service = serviceFactory(serviceContainer);
    console.dir({ service });
    const deps = serviceContainer;
    if (deps.bus) await deps.bus.register(config.name, service);
    this.services.set(config.name, { service, deps, config });
  }
}

export const initServices = async (diContainer, services) => {
  const promises = [];
  for (const { config, factory } of services) {
    const promised = diContainer.addService(factory, config);
    promises.push(promised);
  }
  await Promise.all(promises);
  return diContainer;
};
