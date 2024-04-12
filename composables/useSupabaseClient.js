import { createClient } from "@supabase/supabase-js";

export const useSupabaseClient = () => {
  const config = useRuntimeConfig();
  // yes the key is visible in preious commits, because it was a local installation anyway they are worthless now
  // const supabaseUrl = config.url;
  // const supabaseKey = config.key;
  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};
