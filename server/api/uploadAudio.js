import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler((event) => {
  const supabaseUrl = "https://bphzkvnzvljywziisyeq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHprdm56dmxqeXd6aWlzeWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTkyNDEsImV4cCI6MjAyNDczNTI0MX0.8d9oCoN6TwPo8SD5e-Jpohmf09zQ0G0v35fHPcvKEq0";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const downloadsFolderPath = "./sketches/";

  let trackname;

  try {
    // Read the contents of the Downloads folder
    let files = fs.readdirSync(downloadsFolderPath);

    // Filter out files with a "." in the beginning
    files = files.filter((file) => !file.startsWith("."));

    // Filter out files that are not .ogg files
    let filteredFiles = files.filter((file) => file.endsWith(".ogg"));

    let filteredSketches = files.filter((file) => file.endsWith(".png"));

    // Sort files by their last modification time in ascending order
    const sortedFiles = filteredFiles
      .map((file) => {
        const filePath = path.join(downloadsFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modifiedTime: stats.mtime.getTime(),
        };
      })
      .sort((b, a) => a.modifiedTime - b.modifiedTime);

    console.log("Sorted Files:", sortedFiles);

    const sortedSketches = filteredSketches
      .map((file) => {
        const filePath = path.join(downloadsFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modifiedTime: stats.mtime.getTime(),
        };
      })
      .sort((b, a) => a.modifiedTime - b.modifiedTime);

    console.log("Sorted Sketches:", sortedSketches);

    // Extract just the names of the sorted files
    const sortedFileNames = sortedFiles.map((file) => file.name);
    const fullFilePath = downloadsFolderPath + sortedFileNames[0];
    const readFile = fs.readFileSync(fullFilePath);
    let base64 = readFile.toString("base64");

    if (sortedFileNames && sortedFileNames.length > 0) {
      const firstFile = sortedFileNames[0];
      const firstSketch = sortedSketches[0];
      trackname = `${firstSketch.name.substring(
        0,
        firstSketch.name.lastIndexOf(".")
      )}.ogg`;

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/ogg" });
      uploadSketch(trackname, blob);
    } else {
      console.error("No files found in sketchList");
    }

    async function uploadSketch(trackname, blob) {
      const { data, error } = await supabase.storage
        .from("sketches")
        .upload(`tracks/${trackname}`, blob);
    }
    return {
      success: true,
      trackname: trackname,
      firstFile: sortedFileNames[0],
      firstSketch: sortedSketches[0],
    };
  } catch (error) {
    // If there's an error reading the folder, return the error message
    return {
      error: error.message,
    };
  }
});
