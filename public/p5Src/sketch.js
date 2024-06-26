let handsVisible = { value: false };
let leftHandIndexX = { value: 0 };
let leftHandIndexY = { value: 0 };
let leftHandIndexZ = { value: 0 };
let rightHandIndexX = { value: 0 };
let rightHandIndexY = { value: 0 };
let rightHandIndexZ = { value: 0 };
let leftHandThumbX = { value: 0 };
let leftHandThumbY = { value: 0 };
let leftHandThumbZ = { value: 0 };
let rightHandThumbX = { value: 0 };
let rightHandThumbY = { value: 0 };
let rightHandThumbZ = { value: 0 };
let handData = { value: {} };

let hand;
let indexX;
let indexY;
let indexZ;
let thumbX;
let thumbY;
let thumbZ;

let startTime;
let resetTimer = false;
let elapsedTime;

let scene1Timer = false;
// let scene4Timer = false;
let scene5Timer = false;

let sceneMap = new Map();

// Array containing scene names
let sceneNames = ["scene1", "scene2", "scene3", "scene4", "scene5"];

// Initialize the map with all scenes set to false
sceneNames.forEach((sceneName) => {
  sceneMap.set(sceneName, false);
});

// ---WebSocket---
const ws = new WebSocket("ws://localhost:8081");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onmessage = async function (event) {
  const parsedData = JSON.parse(event.data);
  // console.log(parsedData); // Check the received data structure
  console.log(parsedData);

  if (parsedData == "restart") {
    console.log("Restarting the sketch");
    location.reload();
  }

  if (parsedData.hand === "none") {
    handsVisible.value = false;
    // console.log("No hands detected");
  } else {
    handsVisible.value = true;
    hand = parsedData.hand;
    indexX = parsedData[`${hand}-index`].x;
    indexY = parsedData[`${hand}-index`].y;
    indexZ = parsedData[`${hand}-index`].z;
    thumbX = parsedData[`${hand}-thumb`].x;
    thumbY = parsedData[`${hand}-thumb`].y;
    thumbZ = parsedData[`${hand}-thumb`].z;

    // Update your UI or do whatever you need with the data here
    if (hand === "right") {
      leftHandIndexX.value = indexX;
      leftHandIndexY.value = indexY;
      leftHandIndexZ.value = indexZ;
      leftHandThumbX.value = thumbX;
      leftHandThumbY.value = thumbY;
      leftHandThumbZ.value = thumbZ;
      // handsVisible.value = true;
    } else if (hand === "left") {
      rightHandIndexX.value = indexX;
      rightHandIndexY.value = indexY;
      rightHandIndexZ.value = indexZ;
      rightHandThumbX.value = thumbX;
      rightHandThumbY.value = thumbY;
      rightHandThumbZ.value = thumbZ;
      // handsVisible.value = true;
    }
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
    rightHandThumbZ.value,
    handsVisible.value
  );
};

ws.onerror = (error) => {
  console.error("WebSocket error: ", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};

// prevHand for Static checking
let prevRightHandIndexX = null;
let prevRightHandIndexY = null;
let prevRightHandThumbX = null;
let prevRightHandThumbY = null;
let prevLeftHandIndexX = null;
let prevLeftHandIndexY = null;
let prevLeftHandThumbX = null;
let prevLeftHandThumbY = null;

// Recording buffers
let chunks = [];
let blob;
let recorderStarted = false;

let root = 48;
let scale = [
  [0, 2, 4, 5, 7, 9, 11, 12], //Dur Major
];

let scaleNames = ["Major"];

let selectedScale = scale[0];
let selectScale;
let numNotes = 8;
let melody = [];

let beat;
let prevX;
let prevY;

let n;
let note;
let mode = 1;

let pt = [];
let x = 8;
let y = 192;

let speed = 0;
let speedL = 0;
const easing = 0.03;

const partSize = 5;
let particles = [];
const resolution = 10;
const color = "blue";

const max_force = 5;
const min_force = 0;

let spaceX = 35;
let spaceY = 35;
let diam = 2;

let amountX = 200;
let amountY = 100;

let img1, img2, img3;

let state;
let timer1, timer2, timer3, timer4;
let transition = false;

let timer; // Timer variable
let conditionMetTime = 0;

let backgroundColor = "#000000";

function preload() {
  selectedScale = 0;
  img1 = loadImage("../images/01.png");
  img2 = loadImage("../images/02.png");
  img3 = loadImage("../images/03.png");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  generateMelody();
  setTimeSig(8);

  // Deprecated Buttons
  // generateButton = createButton("random");
  // generateButton.position(0, 10);
  // generateButton.mousePressed(generateMelody);

  // playButton = createButton("play");
  // playButton.position(60, 10);
  // playButton.mousePressed(playMelody);

  // // activates the sketch saving process
  // saveButton = createButton("save");
  // saveButton.position(100, 10);
  // saveButton.mousePressed(saveAction);

  // fullScreenButton = createButton("fullscreen");
  // fullScreenButton.position(140, 10);
  // fullScreenButton.mousePressed(toggleFullscreen);

  // clearButton = createButton("clear");
  // clearButton.position(210, 10);
  // clearButton.mousePressed(clearSketch);
}

function stopAudio() {
  // Stop any ongoing audio playback
  Tone.Transport.stop();
  Tone.Transport.cancel();
}

function clearCanvas() {
  // Clear the canvas
  background(0);
}

function draw() {
  stateMachine();

  switch (mode) {
    case 1:
      scene1();
      console.log("scene1");
      break;
    case 2:
      scene2();
      console.log("scene2");
      break;
    case 3: //in between
      scene3();
      console.log("scene3");
      break;
    case 4:
      scene4();
      console.log("scene4");
      break;
    case 5:
      scene5();
      console.log("scene5");
      break;

    // default:
    //   mode = 1;
    //   // stopAudio(); // Stop audio playback
    //   // clearCanvas(); // Clear the canvas

    //   break;
  }

  if (mode != 4 && mode != 3) {
    drawCursors();
  }
}

function drawCursors() {
  xR = map(rightHandIndexX.value, 1, 0, 0, window.innerWidth);
  yR = map(rightHandIndexY.value, 0, 1, 0, window.innerHeight);

  xL = map(leftHandIndexX.value, 1, 0, 0, window.innerWidth);
  yL = map(leftHandIndexY.value, 0, 1, 0, window.innerHeight);

  fill("#FF5D00");
  ellipse(xR, yR, 20);

  fill("#0000B4");
  ellipse(xL, yL, 20);
}

function checkConditions() {
  calculateDistance();
  console.log("Checking conditions");

  // Check if conditions are met
  if (
    // Check for right hand
    (handsVisible.value === true &&
      rightHandIndexX.value &&
      calculateDistance(
        rightHandIndexX.value,
        rightHandIndexY.value,
        rightHandThumbX.value,
        rightHandThumbY.value
      ) <= 0.05) ||
    // Check for left hand
    (handsVisible.value === true &&
      leftHandIndexX.value &&
      calculateDistance(
        leftHandIndexX.value,
        leftHandIndexY.value,
        leftHandThumbX.value,
        leftHandThumbY.value
      ) <= 0.05)
  ) {
    console.log("Pinched");
    if (millis() - conditionMetTime >= 5000) {
      return true;
    }
  } else {
    conditionMetTime = millis();
  }

  return false;
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function stateMachine() {
  xR = map(rightHandIndexX.value, 1, 0, 0, window.innerWidth);
  yR = map(rightHandIndexY.value, 0, 1, 0, window.innerHeight);

  xRt = map(rightHandThumbX.value, 1, 0, 0, window.innerWidth);
  yRt = map(rightHandThumbY.value, 0, 1, 0, window.innerHeight);

  xL = map(leftHandIndexX.value, 1, 0, 0, window.innerWidth);
  yL = map(leftHandIndexY.value, 0, 1, 0, window.innerHeight);

  xLt = map(leftHandThumbX.value, 1, 0, 0, window.innerWidth);
  yLt = map(leftHandThumbY.value, 0, 1, 0, window.innerHeight);

  if (mode === 1 && sceneMap.get("scene1") === false) {
  }
}

// if (
//   mode === 5 &&
//   sceneMap.get("scene1") === true &&
//   sceneMap.get("scene2") === true &&
//   sceneMap.get("scene3") === true &&
//   sceneMap.get("scene4") === true &&
//   sceneMap.get("scene5") === false
// ) {
// if (recorderStarted === true && sceneMap.get("scene5") === false) {
//   // recorder.stop();
//   // console.log("Stopped Recording:", chunks);
//   // saveAction();
//   // recorderStarted = false;
// }
// timer1 = millis();
// timer1 = setTimeout(function () {
//   if (sceneMap.get("scene5") === false) {
//     sceneMap.set("scene5", true);
//     Tone.Transport.stop();
//     Tone.Transport.cancel();
//   }
//   sceneMap.set("scene5", true);
//   mode = 6;
// }, 5000);
// }
// if (mode === 6) {
//   console.log("scene6 has been reached");

//   sceneMap.set("scene1", false);
//   sceneMap.set("scene2", false);
//   sceneMap.set("scene3", false);
//   sceneMap.set("scene4", false);
//   sceneMap.set("scene5", false);
//   console.log(
//     sceneMap.get("scene1"),
//     sceneMap.get("scene2"),
//     sceneMap.get("scene3"),
//     sceneMap.get("scene4"),
//     sceneMap.get("scene5")
//   );
//   mode = 1;
// }

function thisScale() {
  selectedScale = selectScale.value();
  generateMelody();
}

function melodyIndex(note) {
  let melIndex = note - root;
  return scale[selectedScale].indexOf(melIndex);
}

function setTimeSig(ts) {
  Tone.Transport.timeSignature = [ts, 4];
}

function setMelody() {
  beat = Tone.Transport.position.split(":")[1];
  let midiNote = Tone.Frequency(melody[beat], "midi");
  synth.triggerAttackRelease(midiNote);
  instrumentR.triggerAttackRelease("A3");
  instrumentL.triggerAttackRelease("E3");
}

// Start & Stop isch e chli am inneschisse
// function playMelody() {
//   if (Tone.Transport.state == "started") {
//     recorder.stop();
//     saveAction();

//     console.log("Stopped Recording:", chunks);
//     background("black");
//     Tone.Transport.stop();
//     Tone.Transport.cancel();
//     playButton.html("play");
//   } else {
//     recorder.start();
//     console.log("Recording");
//     Tone.Transport.cancel();
//     background("black");
//     Tone.Transport.scheduleRepeat(setMelody, "4n");
//     Tone.Transport.start();
//     playButton.html("stop");
//   }
// }

function setMelody() {
  beat = Tone.Transport.position.split(":")[1];
  let midiNote = Tone.Frequency(melody[beat], "midi");
  synth.triggerAttackRelease(midiNote);
  instrumentR.triggerAttackRelease("A3");
  instrumentL.triggerAttackRelease("E3");
}

function generateMelody() {
  background("black");
  melody = [];
  beat = 0;
  if (melody.length == numNotes) {
    melody.splice(0, melody.length);
  }
  for (let i = 0; i < numNotes; i++) {
    n = int(random(scale[selectedScale].length));
    note = root + scale[selectedScale][n];
    melody.push(note);
  }
}

const toggleFullscreen = () => {
  const fs = !fullscreen();
  fullscreen(fs);
  background(backgroundColor);
};

const clearSketch = () => {
  background(backgroundColor);
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(backgroundColor);
}

function startTimer() {
  startTime = millis();
}
