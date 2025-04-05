import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWebsocketServerModuleEvents } from './ExpoWebsocketServer.types';

declare class ExpoWebsocketServerModule extends NativeModule<ExpoWebsocketServerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWebsocketServerModule>('ExpoWebsocketServer');
