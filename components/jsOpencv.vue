<template>
  <div>
    <div>
      <video id="video" width="640" height="480" autoplay></video>
      <canvas id="canvas" width="640" height="480"></canvas>
    </div>
  </div>
</template>

<script setup>
// Import Libraries
import * as tf from "@tensorflow/tfjs";
import * as handpose from "handpose-js";
import { drawHand } from "handpose-js/draw";
import WebSocket from "ws";

// Create a WebSocket connection
const ws = new WebSocket("ws://localhost:8081");

// Grabbing the Hand Model from Handpose and
// Initializing the Model
const model = await handpose.load();

// Setting up the video element and canvas
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Setting up the camera stream
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
video.srcObject = stream;
await new Promise((resolve) => (video.onloadedmetadata = resolve));

// Initializing current time and precious time for calculating the FPS
let previousTime = 0;
let currentTime = 0;

// Function to process the video frame
async function processVideoFrame() {
  // Capture the video frame
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Making predictions using handpose model
  const predictions = await model.estimateHands(canvas);

  // Code to access landmarks
  if (predictions.length > 0) {
    for (let prediction of predictions) {
      for (let landmark of prediction.landmarks) {
        if (landmark[0] === 8 || landmark[0] === 4) {
          // index finger tip or thumb tip
          const landmarkData = {
            hand: "right", // handpose.js does not provide handedness information
            x: landmark[1],
            y: landmark[2],
            z: landmark[3],
          };
          ws.send(JSON.stringify(landmarkData));
        }
      }

      // Draw the hand landmarks on the canvas
      drawHand(canvas, prediction, { color: "red" });
    }
  }

  // fps calculation
  currentTime = performance.now();
  const fps = 1 / (currentTime - previousTime);
  previousTime = currentTime;

  // Displaying FPS on the canvas
  ctx.font = "20px Arial";
  ctx.fillStyle = "green";
  ctx.fillText(`FPS: ${fps.toFixed(2)}`, 10, 30);

  // Request the next frame
  requestAnimationFrame(processVideoFrame);
}

// Start processing the video frames
processVideoFrame();
</script>

<style lang="scss" scoped></style>
