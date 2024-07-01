import { SystemEvent } from "../common/const";
import { GSSystemEventType, GS_SYSTEM_EVENT_TYPES } from "../events/game-server.events";
import { GSSystemBaseMessage, GSSystemGenericMessage, GSSystemPlayersConnected } from "../events/messages/gs-system.message";

// TODO: move as a separate npm package since this is used in quantum-server too
type VoidListener = () => void;
type MessageListener<T> = (message: T) => void;

type Listener<T> = T extends void ? VoidListener : MessageListener<T>;

interface EventMap {
  [eventName: string]: Listener<any>[];
}

export class EventSystem<
  T extends { [K in keyof T]: T[K] extends undefined ? undefined : object }
> {
  private eventMap: EventMap;

  constructor() {
    this.eventMap = {};
  }

  on<K extends keyof T>(eventName: K, listener: Listener<T[K]>): void {
    if (!this.eventMap[eventName as string]) {
      this.eventMap[eventName as string] = [];
    }
    this.eventMap[eventName as string].push(listener);
  }
}

type EventTypes = {
  [K in SystemEvent]: undefined;
} & {
  // [K in GSSystemEventType]: GSSystemBaseMessage;

  [GS_SYSTEM_EVENT_TYPES.PLAYERS_CONNECTED]: GSSystemPlayersConnected;
  [GS_SYSTEM_EVENT_TYPES.GENERIC_MESSAGE]: GSSystemGenericMessage;
} & {
  "HHH": { id: string};
}


const a = new EventSystem<EventTypes>();
a.on('HHH', (m) => {
  m.id
})
a.on('players-connected', (m) => {
  m.type
})
a.on(GS_SYSTEM_EVENT_TYPES.GENERIC_MESSAGE, (m) => {
  m.playerId
})








// export class EventSystem<
//   T extends { [K in keyof T]: T[K] extends undefined ? undefined : object }
// > {
//   private eventMap: EventMap;

//   constructor() {
//     this.eventMap = {};
//   }

//   on<K extends keyof T>(eventName: K, listener: Listener<T[K]>): void {
//     if (!this.eventMap[eventName as string]) {
//       this.eventMap[eventName as string] = [];
//     }
//     this.eventMap[eventName as string].push(listener);
//   }

//   emit<K extends keyof T>(
//     eventName: K extends keyof T ? (T[K] extends undefined ? K : never) : never
//   ): void;
//   emit<K extends keyof T>(
//     eventName: K extends keyof T ? (T[K] extends undefined ? never : K) : never,
//     message: T[K]
//   ): void;

//   // Implementation
//   emit<K extends keyof T>(eventName: K, message?: T[K]): void {
//     const listeners = this.eventMap[eventName as string];
//     if (listeners) {
//       listeners.forEach(listener => {
//         if (message === undefined) {
//           (listener as VoidListener)();
//         } else {
//           (listener as MessageListener<T[K]>)(message);
//         }
//       });
//     }
//   }

//   off<K extends keyof T>(eventName: K, listenerToRemove: Listener<T[K]>): void {
//     const listeners = this.eventMap[eventName as string];
//     if (listeners) {
//       this.eventMap[eventName as string] = listeners.filter(
//         listener => listener !== listenerToRemove
//       );
//     }
//   }
// }