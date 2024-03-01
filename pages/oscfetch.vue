<template>
  <div>
    <h1>{{ oscData }}</h1>
  </div>
</template>

<script setup>
let oscData = ref();

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  // const parsedData = JSON.parse(event.toString()); // Parse JSON string into object
  // oscData.value = parsedData;
  console.log("Received message:", event);
  return (oscData.value = event.data);
};
// ws.on("open", function () {
//   console.log("Connected to WebSocket server");
// });

// ws.on("message", function (data) {
//   const parsedData = JSON.parse(data.toString()); // Parse JSON string into object
//   console.log("Received message:", parsedData);
// });

// onUnmounted(() => {
//   socket.close();
// });
</script>

<style lang="scss" scoped></style>
