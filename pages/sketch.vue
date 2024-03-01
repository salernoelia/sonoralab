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

const fetchOSC = async () => {
  oscData.value = await $fetch("/api/osc");
  gyroX.value = oscData.value.oscData.args[0];
  gyroY.value = oscData.value.oscData.args[1];
  gyroZ.value = oscData.value.oscData.args[2];
  gyroW.value = oscData.value.oscData.args[3];
  console.log(gyroX.value, gyroY.value, gyroZ.value, gyroW.value);
};

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  sketchInstance = new p5((s) => {
    s.setup = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      s.createCanvas(clientWidth, clientHeight).parent(sketchContainer.value);
    };

    s.draw = () => {
      s.x = s.map(gyroX.value, -1, 1, 0, s.width);
      s.y = s.map(-gyroY.value, -1, 1, 0, s.height);

      s.background(220);
      s.ellipse(s.x, s.y, 200, 200);
    };
  });
};

onMounted(async () => {
  setupSketch();
  fetchOSC();
});

// Set up an interval to fetch data every second
const timer = setInterval(fetchOSC, 100);
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
