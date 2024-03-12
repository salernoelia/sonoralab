import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://bphzkvnzvljywziisyeq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHprdm56dmxqeXd6aWlzeWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTkyNDEsImV4cCI6MjAyNDczNTI0MX0.8d9oCoN6TwPo8SD5e-Jpohmf09zQ0G0v35fHPcvKEq0";
const supabase = createClient(supabaseUrl, supabaseKey);

const saveSketch = async () => {
  //   await save();
  setTimeout(async () => {
    try {
      const response = await fetch("../../api/fetchLocalSketch");
      const sketchList = await response.json();
      console.log("SketchList:", sketchList);
      if (sketchList && sketchList.files && sketchList.files.length > 0) {
        const firstFile = sketchList.files[0];
        // const readFile = sketchList.readFile;
        // const fullPath = sketchList.fullFilePath;
        const base64 = sketchList.base64;
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        uploadSketch(firstFile, blob);
      } else {
        console.error("No files found in sketchList");
      }
    } catch (error) {
      console.error("Error fetching sketchList:", error);
    }
  }, 200);
};

async function uploadSketch(sketchname, blob) {
  const { data, error } = await supabase.storage
    .from("sketches")
    .upload(`sketches/${sketchname}`, blob);

  const { meta, err } = await supabase.from("sketchesMeta").insert([
    {
      name: sketchname,
      path: `sketches/${sketchname}`,
    },
  ]);

  console.log("Meta Uploaded of sketch:", meta);
}
