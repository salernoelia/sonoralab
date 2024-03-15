<template>
  <div class="infocontainer">
    <img style="width: 700px" src="assets/help.png" alt="" srcset="" />
  </div>
  <div class="parent">
    <!-- <h1>Sonora Lab</h1> -->
    <img
      src="assets/logo/sonora-lab-black.svg"
      style="width: 200px; margin-top: 60px"
      alt="Sonora Lab"
    />
    <div class="dashboard">
      <!-- <NuxtLink to="/handSketch" target="_blank">
        <button class="button-main">
          (Deprecated) Hand Recognition Sketch
        </button>
      </NuxtLink> -->

      <NuxtLink to="/hands.html" target="_blank">
        <button class="button-main">Start Hand Recognition</button>
      </NuxtLink>
      <NuxtLink to="/p5.html" target="_blank">
        <button class="button-main">Start Visualization</button>
      </NuxtLink>
      <NuxtLink to="/gallery" target="_blank">
        <button class="button-main">Start Gallery</button>
      </NuxtLink>
      <button @click="restartApplication()" class="button-attention">
        Restart Application
      </button>
    </div>

    <div class="console-container">
      <div class="console">
        <p>Incoming Data:</p>
        <p>{{ handData }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Call this function when you want to restart the application

let handData = ref();

const socket = new WebSocket("ws://localhost:8081");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  console.log("Received message:", event);
  return (handData.value = JSON.parse(event.data));
};

function restartApplication() {
  socket.send(JSON.stringify("restart"));
}
</script>

<style scoped>
* {
  font-family: "Hanken Grotesk", sans-serif;

  /* font-family: "Courier New", Courier, monospace; */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.infocontainer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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

.button-attention {
  background-color: #ffffff;
  border: none;
  color: rgb(255, 0, 0);
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ff0000;
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
  margin-top: 60px;

  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  text-align: center;
}

.console-container {
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 20px 20px 0 0;
  width: 90%;
  height: 50px;
}

.console {
  width: 100%;
  line-height: normal;
  p {
    margin: 0;
  }
}
</style>
