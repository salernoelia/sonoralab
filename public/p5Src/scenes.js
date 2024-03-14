function scene1() {
  if ((xR && yR) || (xL && yL)) {
    sceneMap.set("scene1", true);

    timer1 = setTimeout(function () {
      mode = 2;
      timer1 = millis();
    }, 3000);
  }
  image(img1, 0, 0, window.innerWidth, window.innerHeight);
}
function scene2() {
  if (resetTimer === false) {
    startTimer();
    resetTimer = true;
  }
  if (millis() - startTime > 15000 && checkConditions() === false) {
    mode = 1;
  } else if (checkConditions() === true) {
    sceneMap.set("scene2", true);
    resetTimer = false;
    startTime = 0;
    timer1 = millis();
    mode = 3;
  }
  console.log("scene2 elapsed kack", elapsedTime);
  console.log("scene2 conditionMetTime", conditionMetTime);

  image(img2, 0, 0, window.innerWidth, window.innerHeight);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(86);

  elapsedTime = (millis() - conditionMetTime) / 1000;

  let str = elapsedTime.toFixed(1);
  text(str, window.innerWidth / 2, window.innerHeight / 1.1);

  ellipse;
}
function scene3() {
  timer1 = setTimeout(function () {
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat(setMelody, "4n");
    if (recorderStarted === false) {
      recorder.start();
      console.log("Recording");
      recorderStarted = true;
      sceneMap.set("scene3", true);

      mode = 4;
    }
  }, 30);
  background(0);
}

function scene4() {
  timer1 = millis();

  timer1 = setTimeout(function () {
    if (sceneMap.get("scene4") === false) {
      mode = 5;
      sceneMap.set("scene4", true);
    }
    timer1 = millis();
  }, 15000);

  calculateDistance();
  xR = map(rightHandIndexX.value, 1, 0, 0, window.innerWidth);
  yR = map(rightHandIndexY.value, 0, 1, 0, window.innerHeight);

  xRt = map(rightHandThumbX.value, 1, 0, 0, window.innerWidth);
  yRt = map(rightHandThumbY.value, 0, 1, 0, window.innerHeight);

  xL = map(leftHandIndexX.value, 1, 0, 0, window.innerWidth);
  yL = map(leftHandIndexY.value, 0, 1, 0, window.innerHeight);

  xLt = map(leftHandThumbX.value, 1, 0, 0, window.innerWidth);
  yLt = map(leftHandThumbY.value, 0, 1, 0, window.innerHeight);

  //--Instrument_R Controls
  let lowpassFreq = map(yR, window.innerHeight, 0, 200, 1000);
  lowpassR.frequency.value = lowpassFreq;

  let instrumentRVol = map(yR, window.innerHeight, 0, -5, 0);
  instrumentR.volume.value = instrumentRVol;

  const lfoFrequency = map(xR, 0, window.innerWidth, 0, 10);
  filterR.frequency.value = lfoFrequency;

  //--Instrument_L Controls
  let instrumentLFreq = map(yL, window.innerHeight, 0, 200, 2000);
  lowpassL.frequency.value = instrumentLFreq;

  let instrumentLVol = map(yL, window.innerHeight, 0, -5, 0);
  instrumentL.volume.value = instrumentLVol;

  const lfoFreq = map(xL, 0, window.innerWidth, 0, 10);
  filterL.frequency.value = lfoFreq;

  // ---Visuals
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
      for (let x = 0; x < window.innerWidth; x += spaceX) {
        for (let y = 0; y < window.innerHeight; y += spaceY) {
          let d = dist(xR, yR, x, y);
          if (d < 25) {
            let r = map(yR, 0, window.innerHeight, 200, 255);
            let g = map(yR, 0, window.innerHeight, 30, 130);
            let b = map(yR, 0, window.innerHeight, 0, 0);
            fill(r, g, b);
            diam = map(d, 0, 45, 30, 1);
            noStroke();
            ellipse(x, y, diam);
          }
        }
      }

      for (let x = 0; x < window.innerWidth; x += spaceX) {
        for (let y = 0; y < window.innerHeight; y += spaceY) {
          let d = dist(xL, yL, x, y);
          if (d < 25) {
            let r = map(yL, window.innerHeight, 0, 10, 90);
            let g = map(yL, window.innerHeight, 0, 10, 100);
            let b = map(yL, window.innerHeight, 0, 180, 255);
            fill(r, g, b);
            diam = map(d, 0, 45, 30, 1);
            noStroke();
            ellipse(x, y, diam);
          }
        }
      }
    }
  }
}
function scene5() {
  if (recorderStarted === true && sceneMap.get("scene5") === false) {
    recorder.stop();
    console.log("Stopped Recording:", chunks);
    saveAction();
    recorderStarted = false;
  }
  timer1 = millis();

  timer1 = setTimeout(function () {
    if (sceneMap.get("scene5") === false) {
      sceneMap.set("scene5", true);
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }

    sceneMap.set("scene5", true);
    mode = 6;
  }, 5000);
  if (
    mode === 5 &&
    sceneMap.get("scene1") === true &&
    sceneMap.get("scene2") === true &&
    sceneMap.get("scene3") === true &&
    sceneMap.get("scene4") === true &&
    sceneMap.get("scene5") === false
  ) {
    image(img3, 0, 0, window.innerWidth, window.innerHeight);
  } else {
    console.log("Bohoo, scene 5 cannot start because of", mode);
    mode = 1;
    startTime = millis();
    console.log("Starttime from scenes", startTime);
  }
}

function scene6() {
  background(0);
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
