import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWebsocketServerModuleEvents } from './ExpoWebsocketServer.types';

declare class ExpoWebsocketServerModule extends NativeModule<ExpoWebsocketServerModuleEvents> {
  startServer: (port: number) => Promise<void>;
  stopServer: () => Promise<void>;
  sendToClient: (clientId: string, message: string) => Promise<Boolean>;
  broadcast: (message: string) => Promise<void>;
  getConnectedClients: () => string[];
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWebsocketServerModule>('ExpoWebsocketServer');
