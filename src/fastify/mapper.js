export class FastifyRouteMapper {
  constructor({ bus }) {
    this.bus = bus;
  }

  toFastifyRoute(name, route) {
    const { method, url, command } = route;
    return {
      method,
      url: `/${name}${url}`,
      handler: async (req, res) => {
        const data = req.body;
        const payload = { data, meta: { traceId: 1 } };
        const response = await this.bus.call(command, payload);
        res.code(200).send(response);
      },
    };
  }
}
