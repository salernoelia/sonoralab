<template>
  <div></div>
</template>

<script setup>
import SMF from "@logue/smfplayer";

const player = new SMF.Player();

window.addEventListener(
  "DOMContentLoaded",
  () => {
    /** @type {boolean} */
    const loop = true;
    /** @type {boolean} */
    const cc111 = true;
    /** @type {boolean} */
    const falcom = true;
    /** @type {boolean} */
    const mfi = true;
    /** @type {number} */
    const tempo = 1.0;
    /** @type {number} 0-16383 */
    const volume = 16383 * 0.5;

    // player settings
    player.setLoop(loop); // Player Loop
    player.setCC111Loop(cc111); // CC#111 Loop
    player.setFalcomLoop(falcom); // Ys2 Eternal Loop
    player.setMFiLoop(mfi); // MFi Loop
    player.setTempoRate(tempo); // Playback tempo rate
    player.setMasterVolume(volume); // Master Volume
    player.setWebMidiLink("https://logue.dev/smfplayer.js/wml.html");

    // load standard MIDI file
    loadSMF("hoge.mid");
  },
  false
);

/**
 * @param {string} url
 */
function loadSMF(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.arrayBuffer();
    })
    .then((arraybuffer) => {
      /** @type {string} */
      const ext = url.split(".").pop();
      switch (ext) {
        case "midi":
        case "mid":
          // Load MIDI file
          player.loadMidiFile(arraybuffer);
          break;
        case "mld":
          // Load Polyphonic Ringtone File
          player.loadMldFile(arraybuffer);
          break;
        case "ms2mml":
          // Load Maple Story 2 MML File
          player.loadMs2MmlFile(arraybuffer);
          break;
        case "mms":
          // Load MakiMabi Sequence MML File
          player.loadMakiMabiSequenceFile(arraybuffer);
          break;
        case "mml":
          // Load 3MLE MML File
          player.load3MleFile(arraybuffer);
          break;
        case "mmi":
          // Load Mabicco MML File
          player.loadMabiIccoFile(arraybuffer);
          break;
        default:
          throw new Error("Unsupported format:" + ext);
      }
      player.play();
    })
    .catch((e) => console.error(e));
}
</script>

<style lang="scss" scoped></style>
