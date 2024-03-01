import { Client, Server } from "node-osc";
import { WebSocketServer } from "ws";

let oscData;
const oscServer = new Server(50001, "0.0.0.0", () => {
  console.log("OSC Server is listening on port 50001");
});

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket Server is listening");

oscServer.on("message", function (msg) {
  console.log("Message received from OSC Server", msg);
  wss.clients.forEach((client) => {
    oscData = JSON.stringify(msg);
    client.send(JSON.stringify(msg)); // Convert msg to JSON string before sending
    console.log("Message sent to client", msg);
  });
});
