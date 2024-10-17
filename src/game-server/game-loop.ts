import { RedisClientType, createClient } from "redis"; // Import Redis client for Node.js
import { GameInstance, QuantumGameServer } from "./game-server";
import { BaseMessage } from "../events/messages/base.message";
import {
  getGameInstanceMessagesKey,
  getGameInstanceMessagesKeyWithRedisGameInstanceKey,
  getUpdatedGameInstancesKey,
} from "../common/access-patterns/access-patterns";
import { PlayerData } from "./types/player.types";

// Lua script to atomically fetch the oldest entry and acquire a lock
const luaScript = `
 local oldestEntry = redis.call('ZRANGE', KEYS[1], 0, 0)
  if #oldestEntry > 0 then
    local id = oldestEntry[1]
    local lockKey = 'lock:' .. id
    local lockAcquired = redis.call('SETNX', lockKey, 'locked')
    if lockAcquired == 1 then
      redis.call('PEXPIRE', lockKey, ARGV[1])
      return id
    end
  end
  return nil
`;

export type TickType<
  T extends object = any,
  M extends BaseMessage<any> = BaseMessage<any>
> = (gameInstance: GameInstance<T, M>, gameServer: QuantumGameServer) => Promise<T>;

type GameLoopProps<
  T extends object = any,
  M extends BaseMessage<any> = BaseMessage<any>
> = {
  loopRate: number;
  redisClient: RedisClientType;
  quantumGameServer: QuantumGameServer;
  tick: TickType<T, M>;
};

export const getGameLoop = <
  T extends object,
  M extends BaseMessage<any> = BaseMessage<any>
>({
  loopRate,
  redisClient,
  tick,
  quantumGameServer,
}: GameLoopProps<T, M>) => {
  async function gameLoop() {
    try {
      const id = await redisClient.eval(luaScript, {
        keys: [getUpdatedGameInstancesKey()],
        arguments: [loopRate.toString()],
      });

      if (id) {
        const entryId = id as string; // Cast the result to a string (entry ID)

        const messageArray = await redisClient.lRange(
          getGameInstanceMessagesKeyWithRedisGameInstanceKey(entryId),
          0,
          -1
        ); // Fetch input array
        const instance = await redisClient.hGetAll(entryId);

        if (!instance) {
          await redisClient.zRem(getUpdatedGameInstancesKey(), entryId);
          throw Error(`No Instance! ${entryId}`);
        }

        const gameInstance: GameInstance<T, M> = {
          id: instance.id,
          updated: parseInt(instance.updated) || 0,
          state: JSON.parse(instance.state || "{}") as T,
          players: JSON.parse(instance.players || "[]") as PlayerData[],
          messages: messageArray.map(message => {
            return JSON.parse(message) as M;
          }),
        };
        const newState = await tick(gameInstance, quantumGameServer);

        await redisClient.del(
          getGameInstanceMessagesKeyWithRedisGameInstanceKey(entryId)
        ); // Clear the input array

        // Update the state and timestamp in Redis
        const updatedTimestamp = Date.now();
        
        await redisClient.hSet(`${entryId}`, {
          state: JSON.stringify(newState),
          updated: updatedTimestamp,
        });
        
        await redisClient.zAdd(getUpdatedGameInstancesKey(), {
          score: updatedTimestamp,
          value: entryId,
        });
        
        gameLoop();
      } else {
        // No entries to process, wait for 1ms and try again
        setTimeout(gameLoop, 1);
      }
    } catch (error) {
      console.error("Error processing oldest entry:", error);
    }
  }

  return gameLoop;
};
