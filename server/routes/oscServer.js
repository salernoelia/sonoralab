import { Server } from "node-osc";
import { WebSocketServer } from "ws";

const oscServer = new Server(50001, "0.0.0.0", () => {
  console.log("OSC Server is listening on port 50001");
});

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket Server is listening");

oscServer.on("message", function (msg) {
  console.log("Message received from OSC Server", msg);
  let stringifiedMSG = JSON.stringify(msg);
  let parsedMSG = JSON.parse(stringifiedMSG);

  wss.clients.forEach((client) => {
    client.send(JSON.stringify(parsedMSG)); // Convert parsedMSG to JSON string before sending
    console.log("Message sent to client", parsedMSG);
  });
});
