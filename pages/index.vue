<template>
  <div>
    <div>
      <p>{{ oscData }}</p>
    </div>
  </div>
</template>

<script setup>
let oscData = ref();

const fetchOSC = async () => {
  oscData.value = await $fetch("/api/osc");
};

// Fetch data initially when the component is mounted
onMounted(fetchOSC);

// Set up an interval to fetch data every second
const timer = setInterval(fetchOSC, 50);
</script>
