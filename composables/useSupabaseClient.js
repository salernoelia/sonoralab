import { createClient } from "@supabase/supabase-js";
export const usSupabaseClient = () => {
  const supabaseUrl = "https://bphzkvnzvljywziisyeq.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaHprdm56dmxqeXd6aWlzeWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxNTkyNDEsImV4cCI6MjAyNDczNTI0MX0.8d9oCoN6TwPo8SD5e-Jpohmf09zQ0G0v35fHPcvKEq0";
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};
