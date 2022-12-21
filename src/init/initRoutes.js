import routeGroups from '../api/router.js';
import { FastifyRouteMapper } from '../fastify/mapper.js';

export const initRoutes = ({ bus }) => {
  const fastifyRouteMapper = new FastifyRouteMapper({ bus });

  const fastifyRoutes = [];

  for (const [apiPrefix, routes] of Object.entries(routeGroups)) {
    for (const route of routes) {
      const fastifyRoute = fastifyRouteMapper.toFastifyRoute(apiPrefix, route);
      fastifyRoutes.push(fastifyRoute);
    }
  }

  return fastifyRoutes;
};
