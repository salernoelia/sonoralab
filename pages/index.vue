<template>
  <div class="parent">
    <div class="dashboard">
      <h1>Sonora Lab</h1>
      <NuxtLink to="/gallery">
        <button class="button-main">Gallery</button>
      </NuxtLink>
      <NuxtLink to="/handSketch">
        <button class="button-main">(Deprecated) Hand Recognition Sketch</button>
      </NuxtLink>
      <button class="button-main">
        <a
          style="color: black; font-style: normal; text-decoration: none"
          href="http://127.0.0.1:8080/p5.html"
        >
          Sketch
        </a>
      </button>
      <button class="button-main">
        <a
          style="color: black; font-style: normal; text-decoration: none"
          href="http://127.0.0.1:8080/hands.html"
        >
          Hand Recognition
        </a>
      </button>
    </div>
    <div class="console">
      <p>Hand Data:</p>
      <p>{{ handData }}</p>
    </div>
  </div>
</template>

<script setup>
let handData = ref();

const socket = new WebSocket("ws://localhost:8081");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  console.log("Received message:", event);
  return (handData.value = JSON.parse(event.data));
};
</script>

<style scoped>
* {
  font-family: "Hanken Grotesk", sans-serif;

  /* font-family: "Courier New", Courier, monospace; */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.button-main {
  background-color: #ffffff;
  border: none;
  color: rgb(0, 0, 0);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #000000;
  width: 200px;
  height: 60px;
}

.parent {
  display: flex;
  position: absolute;
  flex-direction: row;
  inset: 0;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.dashboard {
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  text-align: center;
}

.console {
  bottom: 0;
  left: 0;
  width: 200px;
  height: 220px;
  background-color: #ffffff;
  border: 1px dashed #000000;
  overflow-y: scroll;
  padding: 20px;
}
</style>
