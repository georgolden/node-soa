type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HttpDataSource = 'QueryParams' | 'JSONBody';

export type HttpRoute = {
  method: HttpMethod;
  url: string;
  command: string;
  dataSource: HttpDataSource;
};
