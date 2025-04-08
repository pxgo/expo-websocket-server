export type ExpoWebsocketServerModuleEvents = {
  onServerStart: (e: { port: number }) => void;
  onServerStop: () => void;
  onServerError: (e: { error: Error }) => void;
  onClientOpen: (e: { clientId: string }) => void;
  onClientClose: (e: {
    clientId: string;
    code: number;
    reason: string;
  }) => void;
  onMessage: (e: { clientId: string; message: string }) => void;
  onError: (e: { error: Error; clientId: string }) => void;
};
