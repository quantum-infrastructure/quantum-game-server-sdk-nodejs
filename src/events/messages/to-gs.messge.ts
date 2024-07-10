import { PlayerData } from "../../game-server/types/player.types";
import { TO_GS_EVENT_TYPES, ToGSEventType } from "../game-server.events";
import { BaseMessage } from "./base.message";

export type ToGSBaseMessage<T = unknown> = BaseMessage<T> & {
};

export type ToGSGenericMessage<T = unknown> = BaseMessage<T> & {
  playerId: string;
};

export type ToGSPlayerConnected<T = unknown> = BaseMessage<T> & {
  players: PlayerData[];
};
export type ToGSPlayerDisconnected<T = unknown> = BaseMessage<T> & {
  players: PlayerData[];
};