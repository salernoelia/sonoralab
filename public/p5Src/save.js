// API call to save the sketch to Supabase
const saveSketch = async () => {
  setTimeout(async () => {
    try {
      const response = await fetch("../../api/fetchLocalSketch");
      if (response.ok) {
        console.log("Sketch is saved to supabase");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
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
    await fetch("/api/uploadAudio");
  }, 100);
};
