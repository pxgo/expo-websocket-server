import { registerWebModule, NativeModule } from 'expo';

import { ExpoWebsocketServerModuleEvents } from './ExpoWebsocketServer.types';

class ExpoWebsocketServerModule extends NativeModule<ExpoWebsocketServerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoWebsocketServerModule);
