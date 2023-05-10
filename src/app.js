import { fastify } from 'fastify';
import serverConf from './config/server.js';
import { initRoutes } from './init/initRoutes.js';
import { getFactories } from './infra/infra.index.js';
import { DiContainer, initServices } from './dfs/diContainer.js';
import serviceFactories from './services/services.index.js';

const server = fastify({ logger: true });

const depFactories = getFactories();
const diContainer = new DiContainer(depFactories);
await initServices(diContainer, serviceFactories);

await Promise.all(diContainer.init());

const fastifyRoutes = initRoutes({ bus: diContainer.instances.nodeBus });

console.dir(fastifyRoutes, { depth: 10 });

for (const fsRoute of fastifyRoutes) {
  server.route(fsRoute);
}

await server.listen(serverConf);
