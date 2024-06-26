import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { io, Socket } from "socket.io-client";
import {
  isEvent,
  isMessageType,
  isSystemEvent,
  MessageTypes,
} from "./common/const";
import { GameServerEvents } from "./game-server-events";
import { FromGSBaseMessage, ToGSBaseMessage } from "./events/game-server.message";

// export type IncomingMessage = {
//   eventName: string;
//   message: string;
//   fromPlayer?: string;
// };

// export type IncomingGenericMessage = {
//   eventName: string;
//   message: string;
//   fromPlayer?: string;
// };

// export type OutgoingMessage = {
//   eventName: string;
//   message: string;
//   toPlayer?: string;
// };

// type Player = {
//   playerId: string;
//   playerData: unknown;
// };

export type QuantumGameServerProps = {
  qsPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;
};

export class QuantumGameServer {
  connection: Socket;
  public on(...args: Parameters<GameServerEvents['on']>): ReturnType<GameServerEvents['on']> {
    return this.eventSystem.on(...args);
  }
  public off(...args: Parameters<GameServerEvents['off']>): ReturnType<GameServerEvents['off']> {
    return this.eventSystem.off(...args);
  }

  eventSystem: GameServerEvents;

  qsPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;

  constructor(quantumGameServerProps: QuantumGameServerProps) {
    //TODO: validate configuration!
    this.qsPort = quantumGameServerProps.qsPort;
    this.qsGSServerId = quantumGameServerProps.qsGSServerId;
    this.qsGSServerSecret = quantumGameServerProps.qsGSServerSecret;
    this.eventSystem = new GameServerEvents();

    this.connection = io(`http://localhost:${this.qsPort}/server`, {
      transports: ["websocket"],
      autoConnect: false,
    });


    this.connection.onAny((eventName: string, message: ToGSBaseMessage) => {
      console.log(eventName, "asdasd");
      if (isMessageType(eventName)) {
        return this.eventSystem.emit(eventName, message);
      } else {
        console.warn("An unknown message appeared", eventName, message);
      }
    });
    this.connection.on('connect', () => {
        return this.eventSystem.emit('connect');
    });
    this.connection.on('disconnect',() => {
        return this.eventSystem.emit('disconnect');
    });
  }

  async sendMessage<T = unknown>(
    eventName: string,
    payload: FromGSBaseMessage
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.connection.connected) {
        this.connection.emit(eventName, payload, (response: T) => {
          resolve(Promise.resolve(response));
        });
      } else {
        reject(Error("Socket Connection Closed"));
      }
    });
  }

  async sendGenericMessage<T = unknown>(message: FromGSBaseMessage): Promise<T> {
    return await this.sendMessage(MessageTypes.GENERIC_MESSAGE, {
      ...message
    });
  }

  async start() {
    this.connection.auth = {
      qsGSServerId: this.qsGSServerId,
      qsGSServerSecret: this.qsGSServerSecret,
    };
    this.connection.connect();
  }
}
