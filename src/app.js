import { fastify } from 'fastify';
import serverConf from './config/server.js';
import { initServices } from './init/initServices.js';
import { initRoutes } from './init/initRoutes.js';

const server = fastify({ logger: true });

const { bus } = await initServices();
const fastifyRoutes = initRoutes({ bus });

console.dir(fastifyRoutes, { depth: 10 });

for (const fsRoute of fastifyRoutes) {
  server.route(fsRoute);
}

await server.listen(serverConf);
