package expo.modules.websocketserver

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.java_websocket.WebSocket
import org.java_websocket.handshake.ClientHandshake
import org.java_websocket.server.WebSocketServer
import java.net.InetSocketAddress
import java.util.*

class ExpoWebsocketServerModule : Module() {
    private var webSocketServer: WebSocketServer? = null
    private val clientMap = mutableMapOf<String, WebSocket>()

    override fun definition() = ModuleDefinition {
        Name("ExpoWebsocketServer")

        Events(
            "onServerStart",
            "onServerError",
            "onClientOpen",
            "onClientClose",
            "onMessage",
            "onError",
            "onServerStop"
        )

        AsyncFunction("startServer") { port: Int, promise: Promise ->
            if (webSocketServer != null) {
                promise.reject("E_SERVER_RUNNING", "The server is already running.", null)
                return@AsyncFunction
            }

            webSocketServer = object : WebSocketServer(InetSocketAddress(port)) {
                override fun onStart() {
                    sendEvent("onServerStart", mapOf("port" to port))
                }

                override fun onOpen(conn: WebSocket, handshake: ClientHandshake) {
                    val clientId = UUID.randomUUID().toString()
                    clientMap[clientId] = conn
                    sendEvent("onClientOpen", mapOf("clientId" to clientId))
                    conn.send("CONNECTION_ID:$clientId")
                }

                override fun onClose(conn: WebSocket, code: Int, reason: String, remote: Boolean) {
                    val clientId = clientMap.entries.find { it.value == conn }?.key
                    clientId?.let {
                        clientMap.remove(it)
                        sendEvent("onClientClose", mapOf(
                            "clientId" to it,
                            "code" to code,
                            "reason" to reason
                        ))
                    }
                }

                override fun onMessage(conn: WebSocket, message: String) {
                    val clientId = clientMap.entries.find { it.value == conn }?.key
                    clientId?.let {
                        sendEvent("onMessage", mapOf(
                            "clientId" to it,
                            "message" to message
                        ))
                    }
                }

                override fun onError(conn: WebSocket?, ex: Exception) {
                    val clientId = conn?.let { findClientId(it) }
                    sendEvent("onError", mapOf(
                        "error" to ex.message,
                        "clientId" to clientId
                    ))
                }
            }.apply {
                try {
                    start()
                    promise.resolve(true)
                } catch (e: Exception) {
                    webSocketServer = null
                    promise.reject("E_SERVER_START_FAILED", "Failed to start server: ${e.message}", e)
                }
            }
        }

        AsyncFunction("stopServer") { promise: Promise ->
            try {
                webSocketServer?.stop()
                webSocketServer = null
                clientMap.clear()
                sendEvent("onServerStop", emptyMap<String, Any?>())
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("E_SERVER_STOP_FAILED", "-WFailed to stop server: ${e.message}", e)
            }
        }

        AsyncFunction("sendToClient") { clientId: String, message: String, promise: Promise ->
            val conn = clientMap[clientId]
            if (conn != null && conn.isOpen) {
                try {
                    conn.send(message)
                    promise.resolve(true)
                } catch (e: Exception) {
                    promise.reject("E_SEND_FAILED", "Failed to send message: ${e.message}", e)
                }
            } else {
                promise.reject("E_CLIENT_NOT_FOUND", "Client not found or not connected", null)
            }
        }

        AsyncFunction("broadcast") { message: String, promise: Promise ->
            try {
                webSocketServer?.broadcast(message)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("E_BROADCAST_FAILED", "Failed to broadcast message: ${e.message}", e)
            }
        }

        Function("getConnectedClients") {
            clientMap.keys.toList()
        }
    }

    private fun findClientId(conn: WebSocket): String? {
        return clientMap.entries.find { it.value == conn }?.key
    }
}