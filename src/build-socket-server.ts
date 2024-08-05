import { QuantumGameServer } from "./socket-server";

export const buildSocketServer = () => {
  const qsPort = process.env.QS_PORT as unknown as number;
  const qsGSPort = process.env.QS_GS_PORT as unknown as number;
  const qsGSServerId = process.env.QS_GS_SERVER_ID as unknown as string;
  const qsGSServerSecret = process.env.QS_GS_SERVER_SECRET as unknown as string;

  return new QuantumGameServer({
    qsPort,
    qsGSPort,
    qsGSServerId,
    qsGSServerSecret,
  });
};
