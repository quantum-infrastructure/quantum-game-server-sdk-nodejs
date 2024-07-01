import { SystemEvent } from "../../common/const";
import { GSSystemEventType, GS_SYSTEM_EVENT_TYPES } from "../game-server.events";
import { BaseSocketMessage, ModifyType } from "./base.message";

export type GSSystemBaseMessage<T = unknown> = BaseSocketMessage<T>;


export type GSSystemGenericMessage<T = unknown> = GSSystemBaseMessage<T> & {
  playerId?: string;
};
export type GSSystemPlayersConnected<T = unknown> = GSSystemBaseMessage<T> & {
  playerIds: string[];
};
export type GSSystemPlayersDisconnected<T = unknown> = GSSystemBaseMessage<T> & {
  playerIds: string[];
};


type EventTypes = {
  [K in SystemEvent]: undefined;
} & {
  [K in GSSystemEventType]: GSSystemBaseMessage;
}


export type GSSystemEventMessageMappingType = ModifyType<{
  [K in GSSystemEventType]: GSSystemBaseMessage;
}, {
  // [GS_SYSTEM_EVENT_TYPES.GENERIC_MESSAGE]: GSSystemGenericMessage
  // [GS_SYSTEM_EVENT_TYPES.PLAYERS_CONNECTED]: GSSystemPlayersConnected
  // [GS_SYSTEM_EVENT_TYPES.PLAYERS_DISCONNECTED]: GSSystemPlayersDisconnected
}>;