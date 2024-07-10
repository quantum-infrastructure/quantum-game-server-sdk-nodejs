import { BaseMessage } from "./base.message";

export type FromGSBaseMessage<T = unknown> = BaseMessage<T> & {
  gameInstanceId: string;
  playerId: string
};
export type FromGSGenericMessage<T = unknown> = FromGSBaseMessage<T>