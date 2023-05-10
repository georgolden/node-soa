type AnyFunc = (...args: any[]) => any;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HttpDataSource = 'QueryParams' | 'JSONBody';

type HttpHooks = {
  beforeRequest?: AnyFunc[];
  afterRequest?: AnyFunc[];
}

export type HttpRoute = {
  method: HttpMethod;
  url: string;
  command: string;
  dataSource: HttpDataSource;
  hooks?: HttpHooks;
};
