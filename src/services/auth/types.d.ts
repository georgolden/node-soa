import { RedisClient as Redis } from '../../infra/redis';
import { Db } from '../../infra/pg';
import { NodeBus } from '../../infra/nodeBus';
import { IService } from '../../dfs/types';

export { Db } from '../../infra/pg';
export { RedisClient as Redis } from '../../infra/redis';

export type Dependencies = {
  bus: NodeBus;
  cache: Redis;
  db: Db;
};

export type User = {
  id?: string;
  name: string;
  password: string;
  birthDate: Date;
  age: number;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  country: string;
};

export type Payload<T> = {
  data: T;
  meta?: object;
};

export type SigninPayload = Payload<Pick<User, 'email' | 'password'>>;

export function SigninCmd(payload: SigninPayload): Promise<{ token: string }>;

export function SignupCmd(payload: Payload<User>): Promise<void>;

export function ValidateCmd(
  payload: Payload<{ token: string }>,
): Promise<{ valid: boolean }>;

export type Commands = {
  signin: typeof SigninCmd;
  signup: typeof SignupCmd;
  validate: typeof ValidateCmd;
};

export class AuthService implements IService {
  commands: Commands;
  eventHandlers: null;
}
