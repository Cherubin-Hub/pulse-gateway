import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.GATEWAY_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.GATEWAY_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Gateway database credentials missing in .env.local");
}

export const gatewayDb = createClient(supabaseUrl || "", supabaseAnonKey || "");
