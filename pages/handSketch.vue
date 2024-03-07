<template>
  <div class="sketch" ref="sketchContainer">
    <div class="cursor-left" :style="{ top: lY + 'px', left: lX + 'px' }"></div>
    <div
      class="cursor-right"
      :style="{ top: rY + 'px', left: rX + 'px' }"
    ></div>

    <div class="buttonContainer">
      <button class="button" @click="sketchInstance.toggleFullscreen()">
        Toggle fullscreen
      </button>
      <button class="button" @click="saveSketch">Save</button>
      <!-- <input type="file" @change="uploadSketch" /> -->
      <button class="button" @click="sketchInstance.clearSketch()">
        Clear Sketches
      </button>
    </div>
  </div>
</template>

<script setup>
import p5 from "p5";

const supabase = useSupabaseClient();
let sketchList = ref([]);

let handData = ref();
let rightHandIndexX = ref(0);
let rightHandIndexY = ref(0);
let rightHandIndexZ = ref(0);

let leftHandIndexX = ref(0);
let leftHandIndexY = ref(0);
let leftHandIndexZ = ref(0);

let rightHandThumbX = ref(0);
let rightHandThumbY = ref(0);
let rightHandThumbZ = ref(0);

let leftHandThumbX = ref(0);
let leftHandThumbY = ref(0);
let leftHandThumbZ = ref(0);

let backgroundColor = "#4200FF";

let rX = ref(0);
let rY = ref(0);
let lX = ref(0);
let lY = ref(0);

const socket = new WebSocket("ws://localhost:8081");

socket.onopen = async function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = async function (event) {
  const parsedData = JSON.parse(event.data);
  handData.value = parsedData;
  console.log(handData.value);

  if (handData.value.hand == "left-index") {
    leftHandIndexX.value = handData.value.x;
    leftHandIndexY.value = handData.value.y;
    leftHandIndexZ.value = handData.value.z;
  } else if (handData.value.hand == "right-index") {
    rightHandIndexX.value = handData.value.x;
    rightHandIndexY.value = handData.value.y;
    rightHandIndexZ.value = handData.value.z;
  } else if (handData.value.hand == "left-thumb") {
    leftHandThumbX.value = handData.value.x;
    leftHandThumbY.value = handData.value.y;
    leftHandThumbZ.value = handData.value.z;
  } else if (handData.value.hand == "right-thumb") {
    rightHandThumbX.value = handData.value.x;
    rightHandThumbY.value = handData.value.y;
    rightHandThumbZ.value = handData.value.z;
  }

  return (
    leftHandIndexX.value,
    leftHandIndexY.value,
    leftHandIndexZ.value,
    rightHandIndexX.value,
    rightHandIndexY.value,
    rightHandIndexZ.value,
    leftHandThumbX.value,
    leftHandThumbY.value,
    leftHandThumbZ.value,
    rightHandThumbX.value,
    rightHandThumbY.value,
    rightHandThumbZ.value
  );
};

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  let context, o, gainNode;

  sketchInstance = new p5((s) => {
    // Define variables for smoothing
    const { clientWidth, clientHeight } = sketchContainer.value;

    // const smoothingFactor = 0.1; // Adjust this value for more or less smoothing
    // let smoothedX = clientWidth / 2;
    // let smoothedY = clientHeight / 2;

    s.setup = () => {
      s.createCanvas(clientWidth, clientHeight).parent(sketchContainer.value);
      s.pg = s.createGraphics(s.width, s.height);
      s.background(backgroundColor);
      s.pg.background(backgroundColor);
      s.noStroke();

      s.previousRightX = null;
      s.previousRightY = null;
      s.previousLeftX = null;
      s.previousLeftY = null;

      context = new AudioContext();
      o = context.createOscillator();
      gainNode = context.createGain(); // Create a gain node
      o.type = "sine";
      o.frequency.setValueAtTime(0, context.currentTime);
      o.connect(gainNode); // Connect oscillator to gain node
      gainNode.connect(context.destination); // Connect gain node to destination
      o.start();

      s.save = async () => {
        await s.pg.save("sketch.jpg");
        s.pg.background(backgroundColor);
        s.background(backgroundColor);
      };

      s.toggleFullscreen = () => {
        const fs = !s.fullscreen();
        s.fullscreen(fs);
        s.pg.background(backgroundColor);
        s.background(backgroundColor);
      };

      s.clearSketch = () => {
        s.pg.background(backgroundColor);
        s.background(backgroundColor);
      };
    };

    s.draw = () => {
      // Smooth the gyro data
      s.rX = s.map(rightHandIndexX.value, 0, 1, s.width, 0);
      s.rY = s.map(rightHandIndexY.value, 0, 1, 0, s.height);
      s.lX = s.map(leftHandIndexX.value, 0, 1, s.width, 0);
      s.lY = s.map(leftHandIndexY.value, 0, 1, 0, s.height);

      rX.value = s.map(rightHandIndexX.value, 0, 1, s.width, 0);
      rY.value = s.map(rightHandIndexY.value, 0, 1, 0, s.height);
      lX.value = s.map(leftHandIndexX.value, 0, 1, s.width, 0);
      lY.value = s.map(leftHandIndexY.value, 0, 1, 0, s.height);

      function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      }

      // Check if data for the left or right hand is available
      if (
        (rightHandIndexX.value &&
          rightHandIndexY.value &&
          rightHandThumbX.value &&
          rightHandThumbY.value) ||
        (leftHandIndexX.value &&
          leftHandIndexY.value &&
          leftHandThumbX.value &&
          leftHandThumbY.value)
      ) {
        // Check if the index finger and thumb are pinched for either hand
        if (
          // Check for right hand
          (rightHandIndexX.value &&
            calculateDistance(
              rightHandIndexX.value,
              rightHandIndexY.value,
              rightHandThumbX.value,
              rightHandThumbY.value
            ) <= 0.05) ||
          // Check for left hand
          (leftHandIndexX.value &&
            calculateDistance(
              leftHandIndexX.value,
              leftHandIndexY.value,
              leftHandThumbX.value,
              leftHandThumbY.value
            ) <= 0.05)
        ) {
          s.fill(0);
          s.pen();

          // Display the pg graphics on the canvas
          s.image(s.pg, 0, 0);
        }
      }

      // Update frequency value dynamically based on hand movement
      const frequency = s.map(s.rX, 0, s.width, 100, 1000); // Map hand movement to frequency range
      const gain = s.map(s.rY, 0, s.height, 0, 1); // Map hand movement to gain range

      o.frequency.setValueAtTime(frequency, context.currentTime);
      gainNode.gain.setValueAtTime(gain, context.currentTime);

      // s.pen();
      // s.image(s.pg, 0, 0); // Display the pg graphics on the canvas
      return { rX, rY, lX, lY };
    };

    s.pen = () => {
      // s.pg.stroke(0, 255, 0);
      s.pg.strokeWeight(1);

      // If previousRightX and previousRightY are not null, draw a line from the previous position to the current position for the right hand
      if (s.previousRightX !== null && s.previousRightY !== null) {
        s.pg.stroke(0, 255, 0);
        s.pg.line(s.rX, s.rY, s.previousRightX, s.previousRightY);
        // s.pg.circle(s.rX, s.rY, 5);
      }

      // If previousLeftX and previousLeftY are not null, draw a line from the previous position to the current position for the left hand
      if (s.previousLeftX !== null && s.previousLeftY !== null) {
        s.pg.stroke(255, 0, 255);
        s.pg.line(s.lX, s.lY, s.previousLeftX, s.previousLeftY);
        // s.pg.circle(s.lX, s.lY, 5);
      }

      // Update previousX and previousY with the current positions for both hands
      s.previousRightX = s.rX;
      s.previousRightY = s.rY;
      s.previousLeftX = s.lX;
      s.previousLeftY = s.lY;
    };

    s.windowResized = () => {
      const { clientWidth, clientHeight } = sketchContainer.value;
      s.resizeCanvas(clientWidth, clientHeight);
      s.pg.resizeCanvas(clientWidth, clientHeight);
      s.pg.background(backgroundColor);
      s.background(backgroundColor);
    };
  });
};

const saveSketch = async () => {
  if (sketchInstance) {
    await sketchInstance.save();
    setTimeout(async () => {
      try {
        const sketchList = await $fetch("api/fetchLocalSketch");
        if (sketchList && sketchList.files && sketchList.files.length > 0) {
          const firstFile = sketchList.files[0];
          // const readFile = sketchList.readFile;
          // const fullPath = sketchList.fullFilePath;
          const base64 = sketchList.base64;
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });
          uploadSketch(firstFile, blob);
        } else {
          console.error("No files found in sketchList");
        }
      } catch (error) {
        console.error("Error fetching sketchList:", error);
      }
    }, 200);
  }
};

async function uploadSketch(sketchname, blob) {
  const { data, error } = await supabase.storage
    .from("sketches")
    .upload(sketchname, blob);

  const { meta, err } = await supabase.from("sketchesMeta").insert([
    {
      name: sketchname,
    },
  ]);

  console.log(sketchname, error);
}

onMounted(async () => {
  setupSketch();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.sketch {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.cursor-left {
  position: fixed;
  z-index: 2;
  width: 1em;
  height: 1em;
  background-color: red;
  border-radius: 50%;
  z-index: 3;
}

.cursor-right {
  position: fixed;
  z-index: 2;
  width: 1em;
  height: 1em;
  background-color: rgb(0, 255, 38);
  border-radius: 50%;
  z-index: 3;
}

.buttonContainer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
