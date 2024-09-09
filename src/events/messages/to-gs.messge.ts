import { PlayerData } from "../../game-server/types/player.types";
import { TO_GS_EVENT_TYPES, ToGSEventType } from "../game-server.events";
import { BaseSocketMessage, ModifyType } from "./base.message";



export type ToGSBaseMessage<T = unknown> = BaseSocketMessage<T> & {
};

export type ToGSGenericMessage<T = unknown> = BaseSocketMessage<T> & {
  playerId?: string;
};

export type ToGSPlayersConnected<T = unknown> = BaseSocketMessage<T> & {
  players: PlayerData[];
};
export type ToGSPlayersDisconnected<T = unknown> = BaseSocketMessage<T> & {
  players: PlayerData[];
};





export type ToGSEventMessageMappingType = ModifyType<{
  [K in ToGSEventType]: ToGSBaseMessage;
}, {
  [TO_GS_EVENT_TYPES.GENERIC_MESSAGE]: ToGSGenericMessage
  [TO_GS_EVENT_TYPES.PLAYERS_CONNECTED]: ToGSPlayersDisconnected
  [TO_GS_EVENT_TYPES.PLAYERS_DISCONNECTED]: ToGSPlayersConnected
}>;