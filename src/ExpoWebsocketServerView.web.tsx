import * as React from 'react';

import { ExpoWebsocketServerViewProps } from './ExpoWebsocketServer.types';

export default function ExpoWebsocketServerView(props: ExpoWebsocketServerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
