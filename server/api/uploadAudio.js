import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const supabaseUrl = "https://bphzkvnzvljywziisyeq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHprdm56dmxqeXd6aWlzeWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTkyNDEsImV4cCI6MjAyNDczNTI0MX0.8d9oCoN6TwPo8SD5e-Jpohmf09zQ0G0v35fHPcvKEq0";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const downloadsFolderPath = "./sketches/";

  const eventBody = await readBody(event);
  const base64 = eventBody.toString("base64");
  const buffer = Buffer.from(base64);
  const arrayBuffer = Uint8Array.from(buffer).buffer;
  const blob = new Blob([arrayBuffer], { type: "audio/ogg" });

  console.log("Array Buffer", arrayBuffer);
  console.log("Blob", blob);

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

    const firstFile = sortedFileNames[0];
    const trackname = `${firstFile.substring(
      0,
      firstFile.lastIndexOf(".")
    )}.wav`;

    if (blob != undefined) {
      uploadAudio(blob);

      async function uploadAudio(blob) {
        const { data, error } = await supabase.storage
          .from("sketches")
          .upload(`tracks/${trackname}`, blob, {
            contentType: "audio/ogg; codecs=opus",
          });
        if (error) {
          console.error(error);
        } else {
          console.log("Track uploaded successfully");
        }
      }
      return {
        statusCode: 200,
        body: "Track uploaded successfully",
        blob: blob,
      };
    } else {
      return {
        statusCode: 500,
        body: "Blob is undefined",
        trackname: trackname,
      };
    }
  } catch (error) {
    console.error(error);
  }
});
