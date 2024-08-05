import { Server, Socket } from "socket.io";
import { Observable } from "rxjs";
import { createServer, Server as HTTPServer } from "http";
import axios from "axios";

const MessageTypes = {
  PLAYER_CONNECTED: "PLAYER_CONNECTED",
  PLAYER_ADDED: "PLAYER_ADDED",
  PLAYER_DISCONNECTED: "PLAYER_DISCONNECTED",
  PLAYER_REMOVED: "PLAYER_REMOVED",
  PLAYER_MESSAGE: "PLAYER_MESSAGE",
} as const;

type Player = {
  playerId: string;
  playerData: unknown;
};

type Message = {
  eventName: string;
  message: string;
};

type QuantumGameServerProps = {
  qsPort: number;
  qsGSPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;
};

export class QuantumGameServer {
  ioServer: Server;
  httpServer: HTTPServer;
  observable: Observable<Message>;
  serverConnection: Socket | undefined;

  qsPort: number;
  qsGSPort: number;
  qsGSServerId: string;
  qsGSServerSecret: string;

  constructor(quantumGameServerProps: QuantumGameServerProps) {
    //TODO: validate configuration!
    this.qsPort = quantumGameServerProps.qsPort;
    this.qsGSPort = quantumGameServerProps.qsGSPort;
    this.qsGSServerId = quantumGameServerProps.qsGSServerId;
    this.qsGSServerSecret = quantumGameServerProps.qsGSServerSecret;
    this.httpServer = createServer();
    this.ioServer = new Server(this.httpServer);
    this.observable = new Observable<Message>(subscriber => {
      this.ioServer.on("connection", (socket: Socket) => {
        this.serverConnection = socket;
        socket.on("generic-message", (message: Message) => {
          console.log(this.qsGSPort, message, "THIIS IT!!!!", Date.now());
          subscriber.next(message);
        });
        socket.emit("generic-message", { kokoza: 1111 });
      });
    });
  }

  async start() {
    this.httpServer.listen(this.qsGSPort);
    //this.httpServer.listen(this.qsGSPort);
    // axios.post(
    //   `http://localhost:${this.qsPort}/game-server/ready/${this.qsGSServerId}/${this.qsGSServerSecret}`
    // );
  }
}
/*

class Player{
    string playerId;
    playerData: unknown;
}

class PlayerPacketData{
    string playerId;
    string payload;
}


class ServerPacketData{
    string payload;
}


class QSGameServer {
    int port;
    Player[] players;
    Event ConnectPlayer(string playerId);
    Event DisconnectPlayer(string playerId);

    void SentPacket(string eventName, string p){}
    void SentPacket(string eventName, string p, string playerId){}
    void SentPacket(string eventName, string p, string[] playerId){}
    Event OnPlayerPacketRecieve(string eventName, PlayerPacketData packet)
    Event OnQSPacketRecieve(string eventName, ServerPacketData packet)

    void Initialize();
}

*/
