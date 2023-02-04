export class DiContainer {
  factories = new Map();
  rawInstances = new Map();
  instances = {};
  starts = [];
  stops = [];
  services = new Map();

  constructor(depFactories) {
    for (const [name, factory] of Object.entries(depFactories)) {
      this.factories.set(name, factory);
      const dep = factory();
      if (dep.start) this.starts.push(dep.start);
      if (dep.stop) this.stops.push(dep.stop);
      this.rawInstances.set(name, dep);
      this.instances[name] = dep.instance;
    }
  }

  init() {
    return this.starts.map((fn) => fn());
  }

  shutdown() {
    return this.stops.map((fn) => fn());
  }

  async addService(serviceFactory, meta) {
    const { dependencies } = meta;
    const serviceContainer = {};
    for (const dep of dependencies) {
      if (typeof dep !== 'string') {
        const [fakeName, depOpts] = dep;
        let realName = '';
        if (typeof depOpts === 'string') {
          realName = depOpts;
        } else {
          realName = depOpts.realName || fakeName;
        }
        if (!this.instances.has(realName)) {
          throw new ReferenceError(
            `Dependency ${dep} required by service ${meta.name} not found`,
          );
        }
      } else {
        if (!this.instances.has(dep)) {
          throw new ReferenceError(
            `Dependency ${dep} required by service ${meta.name} not found`,
          );
        }
        serviceContainer[dep] = this.instances.get(dep);
      }
      const service = serviceFactory(serviceContainer);
      const deps = serviceContainer;
      if (deps.bus) await deps.bus.register(meta.name, service);
      this.services.set(meta.name, { service, deps, meta });
    }
  }
}
