<template>
  <div class="sketch" ref="sketchContainer"></div>
</template>

<script setup>
import p5 from "p5";

let oscData = ref();
let gyroX = ref(0);
let gyroY = ref(0);
let gyroZ = ref(0);
let gyroW = ref(0);

let x, y, z;
let pg;
let osc;
let udp;

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  // console.log("Received message:", event);
  return (oscData.value = JSON.parse(event.data));
};

const fetchOSC = async () => {
  try {
    // console.log(oscData.value);
    gyroX.value = oscData.value[1];
    gyroY.value = oscData.value[2];
    gyroZ.value = oscData.value[3];
    gyroW.value = oscData.value[4];
    // console.log(gyroX.value, gyroY.value, gyroZ.value, gyroW.value);
  } catch (e) {}
};

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  sketchInstance = new p5((s) => {
    s.setup = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      s.createCanvas(clientWidth, clientHeight).parent(sketchContainer.value);
      s.createGraphics(s.width, s.height);
      s.background(255);
      s.noStroke();
    };

    s.draw = () => {
      s.x = s.map(gyroX.value, -1, 1, 0, s.width);
      s.y = s.map(-gyroY.value, -1, 1, 0, s.height);
      s.fill(0);
      s.ellipse(s.x, s.y, 10, 10);
    };

    s.pen = () => {};

    s.windowResized = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      s.resizeCanvas(clientWidth, clientHeight);
    };
  });
};

onMounted(async () => {
  setupSketch();
  fetchOSC();
});

// Set up an interval to fetch data every second
const timer = setInterval(fetchOSC, 16);
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
</style>
