<template>
  <div>
    <h1>Sound</h1>
    <div class="slidecontainer">
      <input
        type="range"
        min="0"
        max="127"
        v-model="slider"
        class="slider"
        id="myRange"
      />

      <button @click="playNote">Play C3</button>
    </div>
    <button @click="startRecording">Start Recording</button>
    <button @click="stopRecording">Stop Recording</button>
    <button @click="uploadTrack">Upload Track</button>
    <button @click="replayTrack">Replay Track</button>
  </div>
</template>

<script setup>
import Soundfont from "soundfont-player";

const supabase = useSupabaseClient();
const slider = ref(200); // Initialize slider with default value
let context = new AudioContext();
let instrument;
let mediaStream;
let mediaRecorder;
let chunks = [];
let gainNode = context.createGain();

// Load the instrument
Soundfont.instrument(context, "acoustic_grand_piano").then(function (piano) {
  instrument = piano;
  instrument.play("C2");
  setupAudioNodes();
});

function playNote() {
  // Map the slider value to a note frequency
  let noteFrequency = slider.value;

  // Play the note with the corresponding frequency
  instrument.play(noteFrequency);
}

function setupAudioNodes() {
  let dest = context.createMediaStreamDestination();
  instrument.connect(dest);
  mediaStream = dest.stream;

  instrument.connect(gainNode);
  gainNode.connect(context.destination);
}

// Watch for changes in the slider value
watch(
  () => slider.value,
  () => {
    // Map the slider value to a note frequency
    let noteFrequency = slider.value;

    // Play the note with the corresponding frequency
    instrument.play(noteFrequency);
  }
);

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
    context.close();
  }
}

function uploadTrack() {
  const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
  const { data, error } = supabase.storage
    .from("sketches")
    .upload("tracks/piano.wav", blob);
  if (error) {
    console.error("Error uploading track", error);
  } else {
    console.log("Track uploaded successfully", data);
  }
}

function replayTrack() {
  const audio = new Audio();
  audio.src = URL.createObjectURL(
    new Blob(chunks, { type: mediaRecorder.mimeType })
  );
  audio.play();
}
</script>

<style lang="scss" scoped></style>
