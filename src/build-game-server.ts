import { QuantumGameServer, QuantumGameServerProps } from "./game-server";



export const buildQuantumGameServer = () => {
  const qsPort = process.env.QS_PORT as unknown as number;
  const qsGSServerId = process.env.QS_GS_SERVER_ID as unknown as string;
  const qsGSServerSecret = process.env.QS_GS_SERVER_SECRET as unknown as string;

  return new QuantumGameServer({
    qsPort,
    qsGSServerId,
    qsGSServerSecret,
  });
};
