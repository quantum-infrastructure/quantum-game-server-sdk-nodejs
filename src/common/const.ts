export const MessageTypes = {
  GENERIC_MESSAGE: 'generic-message',
  PLAYER_CONNECTED: "player-connected",
  PLAYER_ADDED: "player-added",
  PLAYER_DISCONNECTED: "player-disconnected",
  PLAYER_REMOVED: "player-removed",
} as const;

export const SystemEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
} as const;

export const Events = {
  ...MessageTypes,
  ...SystemEvents,
} as const;


export type MessageType = typeof MessageTypes[keyof typeof MessageTypes];
export type SystemEvent = typeof SystemEvents[keyof typeof SystemEvents];
export type Event = typeof Events[keyof typeof Events];

export function isMessageType(value: string): value is MessageType {
  return Object.values(MessageTypes).includes(value as MessageType);
}
export function isSystemEvent(value: string): value is SystemEvent {
  return Object.values(SystemEvents).includes(value as SystemEvent);
}
export function isEvent(value: string): value is Event {
  return Object.values(Events).includes(value as Event);
}

