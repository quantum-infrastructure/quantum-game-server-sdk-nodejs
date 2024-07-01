import { SystemEvent } from "../common/const";
import { GSSystemEventType } from "../events/game-server.events";
import { GSSystemBaseMessage, GSSystemEventMessageMappingType } from "../events/messages/gs-system.message";
import { EventSystem } from "../lib/event-system";


type EventTypes = {
  [K in SystemEvent]: undefined;
} & {
  [K in GSSystemEventType]: GSSystemBaseMessage;
} & {
  "HHH": { id: string};
}

export class GameServerEvents extends EventSystem<EventTypes>{}
  