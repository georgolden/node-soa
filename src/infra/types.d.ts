type AnyFunc = (...args: any[]) => any;
type AnyEventHandler = (event: IPayload) => any;
type AnyServiceCommands = { [key: string]: AnyFunc };
type AnyEventHandlers = { [key: string]: AnyFunc };

export type Factory<T> = {
  start?: T[keyof T];
  instance: T;
  stop?: T[keyof T];
};

type FnSubscribe = (eventName: string, handler: AnyEventHandler) => any;
type FnPublish = (eventName: string, event: IPayload) => any;

export interface IPayload {
  data: object;
  meta?: object;
}

/**
 * Interface for PubSub pattern
 * Contains subcribe and publish functions
 */
export interface IPubSub {
  subscribe: FnSubscribe;
  publish: FnPublish;
}

type FnCall = (commandName: string, payload: IPayload) => Promise<any>;
type FnRegister = (serviceName: string, commands: AnyServiceCommands) => void;

/**
 * Interface for a CommandPattern
 * Contains call and register functions
 */
export interface ICommand {
  call: FnCall;
  register: FnRegister;
}

/**
 * Bus instance must implement
 * at least on of PubSub, Command
 * or EventStreams communication patterns
 * Bus is a mediator
 */
export interface IBus {
  withMeta(meta: object): this;
}
