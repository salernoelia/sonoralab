<template>
  <div class="sketch" ref="sketchContainer">
    <div class="buttonContainer">
      <button class="button" @click="fullscreen()">fullscreen</button>
      <button class="button" @click="save()">save</button>
    </div>
  </div>
</template>

<script setup>
import p5 from "p5";

let oscData = ref();
let gyroX = ref(0);
let gyroY = ref(0);
let gyroZ = ref(0);
let gyroW = ref(0);
let accelX = ref(0);
let accelY = ref(0);
let accelZ = ref(0);

let x, y, z;
let pg;
let osc;
let udp;

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  oscData.value = JSON.parse(event.data);

  if (oscData.value[0] === "/zigsim/quaternion") {
    gyroX.value = oscData.value[1];
    gyroY.value = oscData.value[2];
    gyroZ.value = oscData.value[3];
    gyroW.value = oscData.value[4];
  } else if (oscData.value[0] === "/zigsim/accel") {
    accelX.value = oscData.value[1];
    accelY.value = oscData.value[2];
    accelZ.value = oscData.value[3];
  }

  return (
    gyroX.value,
    gyroY.value,
    gyroZ.value,
    gyroW.value,
    accelX.value,
    accelY.value,
    accelZ.value
  );
};

// const fetchOSC = async () => {
//   try {
//     // console.log(oscData.value);
//     gyroX.value = oscData.value[1];
//     gyroY.value = oscData.value[2];
//     gyroZ.value = oscData.value[3];
//     gyroW.value = oscData.value[4];
//     // console.log(gyroX.value, gyroY.value, gyroZ.value, gyroW.value);
//   } catch (e) {}
// };

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  sketchInstance = new p5((s) => {
    // Define variables for smoothing
    const { clientWidth, clientHeight } = sketchContainer.value;

    const smoothingFactor = 0.1; // Adjust this value for more or less smoothing
    let smoothedX = clientWidth / 2;
    let smoothedY = clientHeight / 2;

    s.setup = () => {
      s.createCanvas(clientWidth, clientHeight).parent(sketchContainer.value);
      s.pg = s.createGraphics(s.width, s.height);
      s.background(255);
      s.noStroke();
      s.previousX = null;
      s.previousY = null;
    };

    s.draw = () => {
      // Smooth the gyro data
      smoothedX = s.lerp(
        smoothedX,
        s.map(-gyroX.value, -1, 1, 0, s.width),
        smoothingFactor
      );
      smoothedY = s.lerp(
        smoothedY,
        s.map(gyroY.value, -1, 1, 0, s.height),
        smoothingFactor
      );

      s.accX = s.map(accelX.value, 0, 1, 0, 1);
      s.accY = s.map(accelY.value, 0, 1, 0, 1);

      s.fill(0);
      if (s.previousX !== null && s.previousY !== null) {
        s.pen();
      }
      s.previousX = smoothedX;
      s.previousY = smoothedY;
      s.image(s.pg, 0, 0); // Display the pg graphics on the canvas
    };

    s.pen = () => {
      s.pg.stroke(0, 0, 0, 255);
      // Use the average of accX and accY to control the stroke weight
      s.pg.strokeWeight((s.accX + s.accY) / 2);
      s.pg.line(smoothedX, smoothedY, s.previousX, s.previousY);
    };

    s.windowResized = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      s.resizeCanvas(clientWidth, clientHeight);
    };
  });
};

onMounted(async () => {
  setupSketch();
});
</script>

<style scoped>
.sketch {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.buttonContainer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
