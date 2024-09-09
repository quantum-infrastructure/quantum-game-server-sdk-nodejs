import { io, Socket } from "socket.io-client";
import { MessageTypes } from "../common/const";
import { GameServerEvents } from "./game-server-events";
import {
  GS_SYSTEM_EVENT_TYPES,
  isFromGSEventType,
  isGSSystemEventType,
  isToGSEventType,
  TO_GS_EVENT_TYPES,
} from "../events/game-server.events";
import { PlayerData } from "./types/player.types";
import {
  ToGSBaseMessage,
  ToGSGenericMessage,
  ToGSPlayersConnected,
  ToGSPlayersDisconnected,
} from "../events/messages/to-gs.messge";
import { FromGSBaseMessage, FromGSGenericMessage } from "../events/messages/from-gs.messge";
import { GSSystemBaseMessage, GSSystemGenericMessage } from "../events/messages/gs-system.message";

export type QuantumGameServerProps = {
  qsPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;
};

export class QuantumGameServer {
  connection: Socket;
  public on(
    ...args: Parameters<GameServerEvents["on"]>
  ): ReturnType<GameServerEvents["on"]> {
    return this.eventSystem.on(...args);
  }
  public off(
    ...args: Parameters<GameServerEvents["off"]>
  ): ReturnType<GameServerEvents["off"]> {
    return this.eventSystem.off(...args);
  }

  eventSystem: GameServerEvents;

  qsPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;
  connectedPlayers: Map<string, PlayerData> = new Map();
  constructor(quantumGameServerProps: QuantumGameServerProps) {
    //TODO: validate configuration!
    this.qsPort = quantumGameServerProps.qsPort;
    this.qsGSServerId = quantumGameServerProps.qsGSServerId;
    this.qsGSServerSecret = quantumGameServerProps.qsGSServerSecret;
    this.eventSystem = new GameServerEvents();

    this.connection = io(`http://localhost:${this.qsPort}/server`, {
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        qsGSServerId: this.qsGSServerId,
        qsGSServerSecret: this.qsGSServerSecret,
      },
    });

    this.connection.onAny((eventName: string, message: ToGSBaseMessage) => {
      if (isToGSEventType(eventName)) {
        switch (eventName) {
          case TO_GS_EVENT_TYPES.GENERIC_MESSAGE:
            const genericMessage = message as ToGSGenericMessage;
            this.eventSystem.emit(GS_SYSTEM_EVENT_TYPES.GENERIC_MESSAGE, {
              type: message.type,
              data: genericMessage.data,
              playerId: genericMessage.playerId
            });
            break;
          case TO_GS_EVENT_TYPES.PLAYERS_CONNECTED:
            this.onPlayerConnected(message as ToGSPlayersConnected);
            break;
          case TO_GS_EVENT_TYPES.PLAYERS_DISCONNECTED:
            this.onPlayerDisconnected(message as ToGSPlayersDisconnected);
            break;
          default:
            return;
        }
      } else {
        console.warn("An unknown message appeared", eventName, message);
      }
    });
    this.connection.on("connect", () => {
      return this.eventSystem.emit("connect");
    });
    this.connection.on("disconnect", () => {
      return this.eventSystem.emit("disconnect");
    });
  }

  private onPlayerConnected(message: ToGSPlayersConnected) {
    console.log(message, "PLAYER CONNECTED - GS")
    message.players.forEach(player => {
      this.connectedPlayers.set(player.id, player);
    });

    this.eventSystem.emit(GS_SYSTEM_EVENT_TYPES.PLAYERS_CONNECTED, {
      type: GS_SYSTEM_EVENT_TYPES.PLAYERS_CONNECTED,
      data: message.data,
      playerIds: message.players.map(player => player.id),
    });
    

  }

  private onPlayerDisconnected(message: ToGSPlayersDisconnected) {
    message.players.forEach(player => {
      this.connectedPlayers.delete(player.id);
    });

    this.eventSystem.emit(GS_SYSTEM_EVENT_TYPES.PLAYERS_DISCONNECTED, {
      type: GS_SYSTEM_EVENT_TYPES.PLAYERS_DISCONNECTED,
      data: message.data,
      playerIds: message.players.map(player => player.id),
    });
  }

  getConnectedPlayerList() {
    return Array.from(this.connectedPlayers).map(p => p[1]);
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

  async sendGenericMessage<T = unknown>(
    message: FromGSGenericMessage
  ): Promise<T> {
    console.log("SDK MESSAGE", message);
    return await this.sendMessage(MessageTypes.GENERIC_MESSAGE, {
      ...message,
    });
  }

  async start() {
    this.connection.connect();
  }
}
