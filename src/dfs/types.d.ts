type AnyFunc = (...args: any[]) => any;
type AnyEventHandler = (event: IPayload) => any;
type AnyServiceCommands = { [key: string]: AnyFunc };
type AnyEventHandlers = { [key: string]: AnyFunc };

type DepShorthand = string;
type DepOpts = { realName?: string; useFactory?: boolean };
type DepLongForm = [DepShorthand, DepShorthand | DepOpts];

export type ServiceConfig = {
  hideMeta: boolean;
  scope: 'local' | 'infra';
  name: string;
  dependencies: Array<DepShorthand | DepLongForm>;
};

export interface IPayload {
  data: object;
  meta?: object;
}

/**
 * Interface for Service to be applicable with infrastructure
 * Each service must return this form init handler
 */
export interface IService {
  commands: AnyServiceCommands | null;
  eventHandlers: AnyEventHandlers | null;
}

export type DomainService<T> = {
  commmads?: T[keyof T];
  eventHandlers?: T[keyof T];
};
