<template>
  <div class="sketch" ref="sketchContainer">
    <div class="buttonContainer">
      <button class="button" @click="sketchInstance.toggleFullscreen()">
        toggle fullscreen
      </button>
      <button class="button" @click="saveSketch">save</button>
      <!-- <input type="file" @change="uploadSketch" /> -->
    </div>
  </div>
</template>

<script setup>
import p5 from "p5";

const supabase = useSupabaseClient();
let sketchList = ref([]);

let handData = ref();
let leftHandX = ref(0);
let leftHandY = ref(0);
let leftHandZ = ref(0);
let rightHandX = ref(0);
let rightHandY = ref(0);
let rightHandZ = ref(0);

const socket = new WebSocket("ws://localhost:8081");

socket.onopen = function (e) {
  console.log("Connected to WebSocket server", e);
};

socket.onmessage = function (event) {
  const parsedData = JSON.parse(event.data);
  handData.value = parsedData;
  console.log(handData.value);

  if (handData.value.hand == "left") {
    leftHandX.value = handData.value.x;
    leftHandY.value = handData.value.y;
    leftHandZ.value = handData.value.z;
  } else if (handData.value.hand == "right") {
    rightHandX.value = handData.value.x;
    rightHandY.value = handData.value.y;
    rightHandZ.value = handData.value.z;
  }

  return (
    leftHandX.value,
    leftHandY.value,
    leftHandZ.value,
    rightHandX.value,
    rightHandY.value,
    rightHandZ.value
  );
};

let sketchContainer = ref(null);
let sketchInstance;

const setupSketch = () => {
  sketchInstance = new p5((s) => {
    // Define variables for smoothing
    const { clientWidth, clientHeight } = sketchContainer.value;

    // const smoothingFactor = 0.1; // Adjust this value for more or less smoothing
    // let smoothedX = clientWidth / 2;
    // let smoothedY = clientHeight / 2;

    s.setup = () => {
      s.createCanvas(clientWidth, clientHeight).parent(sketchContainer.value);
      s.pg = s.createGraphics(s.width, s.height);
      s.background(0, 0, 255);

      s.pg.background(0, 0, 255);
      s.noStroke();
      s.previousRightX = null;
      s.previousRightY = null;
      s.previousLeftX = null;
      s.previousLeftY = null;

      s.save = async () => {
        await s.pg.save("sketch.jpg");
        s.pg.background(0, 0, 255);
      };

      s.toggleFullscreen = () => {
        const fs = !s.fullscreen();
        s.fullscreen(fs);
      };
    };

    s.draw = () => {
      // Smooth the gyro data
      s.rX = s.map(rightHandX.value, 0, 1, s.width, 0);
      s.rY = s.map(rightHandY.value, 0, 1, 0, s.height);
      s.lX = s.map(leftHandX.value, 0, 1, s.width, 0);
      s.lY = s.map(leftHandY.value, 0, 1, 0, s.height);
      // console.log("p5 hands", rightHandX.value, rightHandY.value);

      // s.accX = s.map(accelX.value, 0, 1, 0, 1);
      // s.accY = s.map(accelY.value, 0, 1, 0, 1);
      s.ellipse(s.rX, s.rY, 5, 5);
      s.ellipse(s.lX, s.lY, 5, 5);

      s.fill(0);
      s.pen();
      s.image(s.pg, 0, 0); // Display the pg graphics on the canvas
    };

    s.pen = () => {
      s.pg.stroke(0, 255, 0);
      s.pg.strokeWeight(1);

      // If previousRightX and previousRightY are not null, draw a line from the previous position to the current position for the right hand
      if (s.previousRightX !== null && s.previousRightY !== null) {
        s.pg.line(s.rX, s.rY, s.previousRightX, s.previousRightY);
      }

      // If previousLeftX and previousLeftY are not null, draw a line from the previous position to the current position for the left hand
      if (s.previousLeftX !== null && s.previousLeftY !== null) {
        s.pg.line(s.lX, s.lY, s.previousLeftX, s.previousLeftY);
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
      s.pg.background(0, 0, 255);
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
.sketch {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
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
