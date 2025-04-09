# Expo Websocket Server

A native module for creating a WebSocket server in Expo apps. Easily handle client connections, messages, and server events in your Expo project.

(Currently only supports Android)

## Installation

```bash
npx expo install expo-websocket-server
```

## Usage

```typescript
import WebsocketServer from "expo-websocket-server";

// Start server
await WebsocketServer.startServer(8080);

// Listen to events
WebsocketServer.addListener("onClientOpen", ({ clientId }) => {
  console.log(`Client connected: ${clientId}`);
});

WebsocketServer.addListener("onMessage", ({ clientId, message }) => {
  console.log(`Message from ${clientId}: ${message}`);
});

// Send message to client
await WebsocketServer.sendToClient("client-123", "Hello!");

// Broadcast to all clients
await WebsocketServer.broadcast("Server announcement!");

// Get connected clients
const clients = WebsocketServer.getConnectedClients();
```

## API

### Methods

- `startServer(port: number): Promise<void>`
- `stopServer(): Promise<void>`
- `sendToClient(clientId: string, message: string): Promise<Boolean>`
- `broadcast(message: string): Promise<void>`
- `getConnectedClients(): string[]`

### Events

- `onServerStart`: Server started successfully
- `onServerStop`: Server stopped
- `onServerError`: Server error occurred
- `onClientOpen`: New client connected
- `onClientClose`: Client disconnected
- `onMessage`: Received message from client
- `onError`: Client-specific error

### License

MIT License
