import osc from "osc";

let oscData;

const port = 50001;

// OSC setup
const oscServer = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: port,
});

// Initialization
const startOSCServer = () => {
  oscServer.on("message", (oscMessage) => {
    try {
      // console.log("OSC message received:", oscMessage.address);
      oscData = oscMessage;
    } catch (error) {
      console.error("Error processing OSC message:", error);
    }
  });
  oscServer.open();
};

startOSCServer();

export default defineEventHandler((event) => {
  return {
    oscData,
  };
});
