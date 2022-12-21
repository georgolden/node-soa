import { Bus } from '../infra/ibus';

export interface Injected {
  bus: Bus;
}

/**
 * Any public method will be a command and will be registered as a command via bus
 * Example: AuthService
 * Any private method is ignored by bus, but can be used for event-based communication
 * Example: MailerService
 */
export abstract class AbstractService {
  constructor(injected: Injected);
}
