<template>
  <div>
    <h1>Sound</h1>
    <div class="slidecontainer">
      <input
        type="range"
        min="200"
        max="400"
        v-model="slider"
        class="slider"
        id="myRange"
      />
    </div>
  </div>
</template>

<script setup>
const slider = ref(200); // Initialize slider with default value
const context = new AudioContext();
const o = context.createOscillator();
o.type = "sine";
o.frequency.value = slider.value; // Initialize frequency value

// Watch for changes in the slider value
watch(
  () => slider.value,
  (newValue) => {
    o.frequency.value = newValue; // Update frequency value
  }
);

o.connect(context.destination);
o.start();
</script>

<style lang="scss" scoped></style>
