Tone.Master.volume.value = -10;

// // ---Bandpass
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

synth.volume.value = -20;

let lowpassCello = new Tone.Filter({
  type: "lowpass",
  frequency: 150,
  Q: 1,
}).toMaster();

//--Piano Filters
const filter = new Tone.AutoFilter({
  frequency: 5,
  depth: 0.9,
})
  .toMaster()
  .start();

let lowpass = new Tone.Filter({
  type: "lowpass",
  frequency: 150,
  Q: 1,
}).connect(filter);

const monoSynth = new Tone.Sampler({
  G1: "../samples/contrabass/G1.ogg",
}).connect(lowpass);
monoSynth.volume.value = -5;

const cello = new Tone.Sampler(
  {
    A2: "../samples/cello/A2.ogg",
    A3: "../samples/cello/A3.ogg",
  },
  { portamento: 0 }
).connect(lowpassCello);

//---Recorder
const actx = Tone.context;
const dest = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);
synth.connect(dest);

lowpass.connect(dest);
monoSynth.connect(dest);
bandpass.connect(dest);


cello.connect(dest);