<template>
  <div>
    <div>
      <p>{{ oscData }}</p>
    </div>
  </div>
</template>

<script setup>
let oscData = ref();

const socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  console.log("Received message:", event);
  return (oscData.value = JSON.parse(event.data));
};
</script>
