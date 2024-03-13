import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler((event) => {
  const supabaseUrl = "https://bphzkvnzvljywziisyeq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHprdm56dmxqeXd6aWlzeWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTkyNDEsImV4cCI6MjAyNDczNTI0MX0.8d9oCoN6TwPo8SD5e-Jpohmf09zQ0G0v35fHPcvKEq0";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const downloadsFolderPath = "./sketches/";

  try {
    // Read the contents of the Downloads folder
    let files = fs.readdirSync(downloadsFolderPath);

    // Filter out files with a "." in the beginning
    files = files.filter((file) => !file.startsWith("."));

    // Sort files by their last modification time in ascending order
    const sortedFiles = files
      .map((file) => {
        const filePath = path.join(downloadsFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modifiedTime: stats.mtime.getTime(),
        };
      })
      .sort((b, a) => a.modifiedTime - b.modifiedTime);

    // Extract just the names of the sorted files
    const sortedFileNames = sortedFiles.map((file) => file.name);
    const fullFilePath = downloadsFolderPath + sortedFileNames[0];
    const readFile = fs.readFileSync(fullFilePath);
    console.log("Read file", readFile);
    let base64 = readFile.toString("base64");

    if (sortedFileNames && sortedFileNames.length > 0) {
      const firstFile = sortedFileNames[0];
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
    return {
      success: true,
    };
  } catch (error) {
    // If there's an error reading the folder, return the error message
    return {
      error: error.message,
    };
  }
});
