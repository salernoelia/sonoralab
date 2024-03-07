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
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <button @click="uploadTrack">Upload Track</button>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const slider = ref(200); // Initialize slider with default value
let context = new AudioContext();
let o = context.createOscillator();
o.type = "sine";
o.frequency.value = slider.value; // Initialize frequency value

// Watch for changes in the slider value
watch(
  () => slider.value,
  (newValue) => {
    o.frequency.value = newValue; // Update frequency value
  }
);

let mediaStream;
let mediaRecorder;
let chunks = [];

let dest = context.createMediaStreamDestination();
o.connect(dest);
mediaStream = dest.stream;

let gainNode = context.createGain();
o.connect(gainNode);
gainNode.connect(context.destination);

o.start();

// ... existing code ...

function startRecording() {
  console.log("Started Recording...");
  let dest = context.createMediaStreamDestination();
  gainNode.connect(dest);
  mediaStream = dest.stream;
  mediaRecorder = new MediaRecorder(mediaStream);
  console.log(mediaRecorder);
  chunks = [];
  mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };
  mediaRecorder.start();
}

function stopRecording() {
  console.log("stopped recording...");
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log(chunks);
    context.close(); // Close the AudioContext
  }
}

async function uploadTrack() {
  const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
  const trackname = "4new.wav"; // Provide a name for your audio clip
  const { data, error } = await supabase.storage
    .from("sketches")
    .upload(`tracks/${trackname}`, blob);
  if (error) {
    console.error(error);
  } else {
    console.log("Track uploaded successfully");
    context = new AudioContext(); // Create a new AudioContext
    o = context.createOscillator();
    o.type = "sine";
    o.frequency.value = slider.value;
    o.connect(context.destination);
    o.start();
  }

  // Debugging step: Play the recorded audio in the browser
  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  audio.play();
}
</script>

<style lang="scss" scoped></style>
