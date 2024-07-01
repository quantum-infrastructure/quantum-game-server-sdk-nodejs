import { FROM_GS_EVENT_TYPES, FromGSEventType } from "../game-server.events";
import { BaseSocketMessage, ModifyType } from "./base.message";

export type FromGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
};
export type FromGSGenericMessage<T = unknown> = FromGSBaseMessage<T> & {
  playerIds?: string[]
};


export type FromGSNewMessageType<T = unknown> = BaseSocketMessage<T> & {
  newField?: number;
};


// export type FromGSEventMessageMappingType = {
//   [K in FromGSEventType]: FromGSBaseMessage;
// } & {
//   'NEW_MESSAGE_TYPE': FromGSNewMessageType
// };


export type FromGSEventMessageMappingType = ModifyType<{
  [K in FromGSEventType]: FromGSBaseMessage;
}, {
  [FROM_GS_EVENT_TYPES.GENERIC_MESSAGE]: FromGSGenericMessage
  
}>;