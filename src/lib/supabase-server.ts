import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

// Debug: Check if service role key is available
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables",
  );
} else {
  console.log("SUPABASE_SERVICE_ROLE_KEY is available");
}

// Server-side Supabase client
export const supabaseServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY, // Use service role key for server-side operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
