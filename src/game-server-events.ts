import { MessageType, SystemEvent } from "./common/const";
import { FromGSBaseMessage } from "./events/game-server.message";
import { EventSystem } from "./lib/event-system";


type EventTypes = {
  [K in SystemEvent]: undefined;
} & {
  [K in MessageType]: FromGSBaseMessage;
}
  
export class GameServerEvents extends EventSystem<EventTypes>{}
  