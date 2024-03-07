import { exec } from "child_process";
import path from "path";

// Trigger the Python application
exec(`http-server ./p5/`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting P5 Server: ${error}`);
    return;
  }
  console.log(`P5 Server started: ${stdout}`);
});
