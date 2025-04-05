import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoWebsocketServerViewProps } from './ExpoWebsocketServer.types';

const NativeView: React.ComponentType<ExpoWebsocketServerViewProps> =
  requireNativeView('ExpoWebsocketServer');

export default function ExpoWebsocketServerView(props: ExpoWebsocketServerViewProps) {
  return <NativeView {...props} />;
}
