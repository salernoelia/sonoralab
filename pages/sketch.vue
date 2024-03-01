<template>
  <div class="sketch" ref="sketchContainer"></div>
</template>

<script setup>
import p5 from "p5";

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  sketchInstance = new p5((sketch) => {
    sketch.setup = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      sketch
        .createCanvas(clientWidth, clientHeight)
        .parent(sketchContainer.value);
    };

    sketch.draw = () => {
      sketch.background(220);
      sketch.ellipse(sketch.width / 2, sketch.height / 2, 200, 200);
    };
  }, sketchContainer.value);
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
</style>
