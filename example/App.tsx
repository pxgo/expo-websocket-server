import ExpoWebsocketServer from "expo-websocket-server";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text } from "react-native";

export default function App() {
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const onServerStart = ExpoWebsocketServer.addListener(
      "onServerStart",
      () => {
        console.log("onServerStart");
        setRunning(true);
      },
    );
    const onServerStop = ExpoWebsocketServer.addListener("onServerStop", () => {
      console.log("onServerStop");
      setRunning(false);
    });
    const onServerError = ExpoWebsocketServer.addListener(
      "onServerError",
      (err) => {
        console.log("onServerError");
        console.log(err);
      },
    );
    const onMessage = ExpoWebsocketServer.addListener("onMessage", (e) => {
      console.log("onMessage");
      console.log(e);
    });
    const onError = ExpoWebsocketServer.addListener("onError", (e) => {
      console.log("onError");
      console.log(e);
    });
    const onClientOpen = ExpoWebsocketServer.addListener(
      "onClientOpen",
      (e) => {
        console.log("onClientOpen", e);

        ExpoWebsocketServer.sendToClient(e.clientId, "Hello, i am server")
          .then(() => {
            console.log("Send successfully");
          })
          .catch(console.error);
      },
    );
    const onClientClose = ExpoWebsocketServer.addListener(
      "onClientClose",
      (e) => {
        console.log("onClientClose");
        console.log(e);
      },
    );
    return () => {
      onServerStart.remove();
      onServerError.remove();
      onServerStop.remove();
      onMessage.remove();
      onClientClose.remove();
      onClientOpen.remove();
      onError.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>ExpoWebSocketServer</Text>
        <Button
          title={running ? "Stop" : "start"}
          onPress={async () => {
            if (running) {
              ExpoWebsocketServer.stopServer().catch((err) => {
                console.error(err);
              });
            } else {
              ExpoWebsocketServer.startServer(8099).catch((err) => {
                console.error(err);
              });
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
};
