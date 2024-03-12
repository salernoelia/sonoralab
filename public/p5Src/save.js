const saveSketch = async () => {
  //   await save();
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
