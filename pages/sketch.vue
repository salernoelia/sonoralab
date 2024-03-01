<template>
  <div>
    <div ref="canvas"></div>
  </div>
</template>

<script sketch>
import * as p5 from "p5";

export default {
  setup() {
    const canvas = ref(null);
    const sketch = ref(null);

    onMounted(() => {
      sketch.value = new p5((p) => {
        p.setup = () => {
          canvas.value = p.createCanvas(400, 400);
        };

        p.draw = () => {
          p.background(0);
          p.fill(255);
          p.ellipse(p.width / 2, p.height / 2, 50, 50);
        };
      });
    });

    onBeforeUnmount(() => {
      sketch.value.remove();
    });

    return {
      canvas,
      sketch,
    };
  },
};
</script>

<style lang="scss" scoped></style>
