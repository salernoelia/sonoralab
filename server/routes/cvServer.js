import { WebSocketServer } from "ws";
import { exec } from "child_process";
import path from "path";

// Path to your Python script
const handRecognitionPy = "python/handRecognition.py";

// Trigger the Python application
exec(`python3 ${handRecognitionPy}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting Python application: ${error}`);
    return;
  }
  console.log(`Python application started: ${stdout}`);
});

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
