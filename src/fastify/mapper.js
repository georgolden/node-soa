export class FastifyRouteMapper {
  constructor({ bus }) {
    this.bus = bus;
  }

  toFastifyRoute(name, route) {
    console.dir({ route });
    const { method, url, command } = route;
    return {
      method,
      url: `/${name}${url}`,
      handler: async (req, res) => {
        const payload = req.body;
        const response = await this.bus.command(command, payload);
        res.code(200).send(response);
      },
    };
  }
}
