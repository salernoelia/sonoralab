Tone.Master.volume.value = -20;

// ---Bandpass filter
let bandpass = new Tone.Filter({
    type: "bandpass",
    frequency: 300,
    Q: 1,
  }).toMaster();


  //---Base Synth
  let synth = new Tone.DuoSynth({
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.6,
      release: 1,
    },
  }).connect(bandpass);
  synth.volume.value = -5;


   //--Left hand filters
  const filterL = new Tone.AutoFilter({
    frequency: 5,
    depth: 0.9,
  })
    .toMaster()
    .start();

  let lowpassL = new Tone.Filter({
    type: "lowpass",
    frequency: 150,
    Q: 1,
  }).connect(filterL)


  //--Right hand filters
  const filterR = new Tone.AutoFilter({
    frequency: 5,
    depth: 0.9,
  })
    .toMaster()
    .start();

  let lowpassR = new Tone.Filter({
    type: "lowpass",
    frequency: 150,
    Q: 1,
  }).connect(filterR)


//--Right hand instrument
  const instrumentR = new Tone.Sampler({
    "G1": "./samples/contrabass/G1.ogg"
    }
).connect(lowpassR);
instrumentR.volume.value = -5;


//--Left hand instrument
const instrumentL = new Tone.Sampler({
    "A2": "./samples/cello/A2.ogg",
    }, {portamento: 0
    }
).connect(lowpassL);

//---Recorder
const actx = Tone.context;
const dest = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);

// bandpass.connect(dest);
// filterL.connect(dest);
// filterR.connect(dest);

Tone.Master.connect(dest);