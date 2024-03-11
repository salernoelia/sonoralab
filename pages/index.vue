<template>
  <div class="parent">
    <!-- <h1>Sonora Lab</h1> -->
    <img src="assets/logo/sonora-lab-black.svg" style="width: 200px;" alt="Sonora Lab">
    <div class="dashboard">
      
      <NuxtLink to="/gallery">
        <button class="button-main">Gallery</button>
      </NuxtLink>
      <NuxtLink to="/handSketch">
        <button class="button-main">(Deprecated) Hand Recognition Sketch</button>
      </NuxtLink>
      <button class="button-main">
        <a
          style="color: black; font-style: normal; text-decoration: none"
          href="http://127.0.0.1:5050/p5.html"
        >
          Sketch
        </a>
      </button>
      <button class="button-main">
        <a
          style="color: black; font-style: normal; text-decoration: none"
          href="http://127.0.0.1:5050/hands.html"
        >
          Hand Recognition
        </a>
      </button>
    </div>
    <div class="console-container">
      <div class="console">
        <h3>Console <br></h3>
      <p> {{ handData }}</p>
      </div>
   
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

.console-container {
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  position: absolute;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 20px 20px 0 0;
  width: 90%;
  height: 200px;

}

.console {
  width: 100%;
}
</style>
