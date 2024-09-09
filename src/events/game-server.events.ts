export const BASE_EVENT_TYPES = {
} as const;

export type BaseEventType =
  (typeof BASE_EVENT_TYPES)[keyof typeof BASE_EVENT_TYPES];

export const TO_GS_EVENT_TYPES = {
  ...BASE_EVENT_TYPES,
  GENERIC_MESSAGE: 'generic-message',
  PLAYERS_CONNECTED: 'players-connected',
  PLAYERS_DISCONNECTED: 'players-disconnected',
} as const;

export const FROM_GS_EVENT_TYPES = {
  ...BASE_EVENT_TYPES,
  GENERIC_MESSAGE: 'generic-message',
  PLAYER_KICK: 'player-kick',
  SHUTDOWN_SERVER: 'shutdown-server',
  NEW_MESSAGE_TYPE: 'NEW_MESSAGE_TYPE'
} as const;

export const GS_SYSTEM_EVENT_TYPES = {
  ...BASE_EVENT_TYPES,
  GENERIC_MESSAGE: 'generic-message',
  SHUTDOWN_SERVER: FROM_GS_EVENT_TYPES.SHUTDOWN_SERVER,
  PLAYERS_CONNECTED: TO_GS_EVENT_TYPES.PLAYERS_CONNECTED,
  PLAYERS_DISCONNECTED: TO_GS_EVENT_TYPES.PLAYERS_DISCONNECTED,
} as const;



export type ToGSEventType =
  (typeof TO_GS_EVENT_TYPES)[keyof typeof TO_GS_EVENT_TYPES];

export type FromGSEventType =
  (typeof FROM_GS_EVENT_TYPES)[keyof typeof FROM_GS_EVENT_TYPES];

export type GSSystemEventType =
  (typeof GS_SYSTEM_EVENT_TYPES)[keyof typeof GS_SYSTEM_EVENT_TYPES];

export function isFromGSEventType(value: string): value is FromGSEventType {
  return Object.values(FROM_GS_EVENT_TYPES).includes(value as FromGSEventType);
}
export function isToGSEventType(value: string): value is ToGSEventType {
  return Object.values(TO_GS_EVENT_TYPES).includes(value as ToGSEventType);
}
export function isGSSystemEventType(value: string): value is GSSystemEventType {
  return Object.values(GS_SYSTEM_EVENT_TYPES).includes(value as GSSystemEventType);
}
