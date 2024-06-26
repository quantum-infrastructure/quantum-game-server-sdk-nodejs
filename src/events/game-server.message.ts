import { FromGSEventType, ToGSEventType } from "./game-server.events";

export type BaseSocketMessage<T = unknown> = {
  type: string;
  data?: T;
};

export type ToGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
  playerId?: string;
};
export type FromGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
  playerId?: string;
};

export type ToGSEventMessageMappingType = {
  [K in ToGSEventType]: ToGSBaseMessage;
};

export type FromGSEventMessageMappingType = {
  [K in FromGSEventType]: FromGSBaseMessage;
};
