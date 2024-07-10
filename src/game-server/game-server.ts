import { MessageTypes } from "../common/const";
import { createClient, RedisClientType } from "redis"; // Import Redis client for Node.js
import {
  FromGSBaseMessage,
  FromGSGenericMessage,
} from "../events/messages/from-gs.messge";
import { BaseMessage } from "../events/messages/base.message";
import { PlayerData } from "./types/player.types";
import { getPlayerHeartbeatKey, getPlayerMessageChannelKey } from "../common/access-patterns/access-patterns";
import { getGameLoop, TickType } from "./game-loop";

export type GameInstance<S extends object, M extends BaseMessage<any>> = {
  id: string;
  state: S;
  messages: M[];
  updated: number;
  players: PlayerData[];
};

export type QuantumGameServerProps = {
  loopRate: number;
  redis: {
    redisPort: number;
    redisHost: string;
  };
  tick: TickType;
};

export class QuantumGameServer {
  config: QuantumGameServerProps;
  redisClient: RedisClientType;

  constructor(quantumGameServerProps: QuantumGameServerProps) {
    this.config = quantumGameServerProps;

    const redisConfig = quantumGameServerProps.redis;
    const redisUrl =
      redisConfig.redisHost && redisConfig.redisPort
        ? `redis://${redisConfig.redisHost}:${redisConfig.redisPort}`
        : undefined;

    this.redisClient = createClient({
      url: redisUrl || "redis://localhost:6379",
    });
  }

  async sendMessage<T = unknown>(payload: FromGSBaseMessage) {
    if (this.redisClient.isReady) {
      await this.redisClient.publish(
        getPlayerMessageChannelKey(payload.playerId),
        JSON.stringify(payload)
      );
    } else {
      throw Error("Socket Connection Closed");
    }
  }

  async getConnectedPlayers(playerIds: string[], threshold?: number) {
    const resp = await this.redisClient.mGet(playerIds.map((playerId) => {
      return getPlayerHeartbeatKey(playerId)
    }));

    if(threshold){
      return resp.map((timestamp, i) => {
        if(!timestamp){
          return null;
        }
        const parsedTimestamp = parseInt(timestamp);
        if(!parsedTimestamp){
          return null;
        }
  
        if(Date.now() - parsedTimestamp > threshold){
          return threshold;
        }
  
        return timestamp;
      })    
    }
    
    return resp;
  }

  async start() {
    await this.redisClient.connect();

    const gameLoop = getGameLoop({
      loopRate: this.config.loopRate,
      redisClient: this.redisClient,
      tick: this.config.tick,
      quantumGameServer: this,
    });

    gameLoop();
  }
}
