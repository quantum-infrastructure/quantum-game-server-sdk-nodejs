import { QuantumGameServer, QuantumGameServerProps } from "./game-server";
import { config } from "dotenv";
type BuildQuantumGameServerProps = Omit<
  Partial<QuantumGameServerProps>,
  "tick"
> &
  Pick<QuantumGameServerProps, "tick">;

export const buildQuantumGameServer = ({
  tickRate,
  tick,
  redis,
}: BuildQuantumGameServerProps) => {
  config();
  const _redisHost = redis
    ? redis.redisHost
    : (process.env.REDIS_HOST as unknown as string);
  const _redisPort = redis
    ? redis.redisPort
    : (process.env.REDIS_PORT as unknown as number);
  const _tickRate = tickRate || (process.env.LOOP_RATE as unknown as number) || 30;

  return new QuantumGameServer({
    tickRate: _tickRate,
    redis: {
      redisHost: _redisHost,
      redisPort: _redisPort,
    },
    tick,
  });
};
