import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });
console.log("Server started on port 8081");

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("Backend received: %s", data);

    try {
      // Parse the incoming data as JSON
      const parsedData = JSON.parse(data);

      // Send the parsed data to all connected clients
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(parsedData));
        console.log("Message sent to client", parsedData);
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
});
