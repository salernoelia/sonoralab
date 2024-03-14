
//---------------------------------Save Sketch and Audio---------------------------------

// Checks if the recorder stopped and saves the audio to the chunks array
recorder.ondataavailable = (evt) => chunks.push(evt.data);

// Saves sketch locally and executes the API call to save the sketch to Supabase
const saveAction = async () => {
  console.log("Saving sketch and audio...");
  await save("sketch.png");

  setTimeout(async () => {
    try{
    await saveSketch();
    console.log("Sketch is uploaded to Supabase");
    }
    catch (error){
      console.error("Error uploading sketch:", error);
    }
  }, 3000);

  setTimeout(async () => {
    try {
      await saveAudio();
      console.log("Audio is uploaded to Supabase");
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  }, 3000);
};


// API call to save the sketch to Supabase
const saveSketch = async () => {
  setTimeout(async () => {
    try {
      const response = await fetch("../../api/fetchLocalSketch");
      if (response.ok) {
        console.log("Sketch is saved to supabase");
      }
    } catch (error) {
      console.error("Error uploading sketch:", error);
    }
  }, 50);
};

const saveAudio = async () => {
  let blob = new Blob(chunks, { type: "audio/ogg" });
  chunks = [];

  // Create a blob URL
  let url = URL.createObjectURL(blob);

  // Create a download link and set its href to the blob URL
  let a = document.createElement("a");
  a.href = url;
  a.download = "audio.ogg"; // Set the file name

  // Append the link to the body
  document.body.appendChild(a);

  // Programmatically click the link to start the download
  a.click();
  setTimeout(async () => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
  try {
    await fetch("/api/uploadAudio");
    console.log("Audio is saved to supabase");
  } catch (error) {
    console.error("Error uploading audio:", error);
  }
};
