import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.GATEWAY_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.GATEWAY_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    "⚠️ Gateway database credentials missing in environment variables. Using safe build-time fallback client."
  );
}

// Fallback to placeholder to prevent Next.js build-time crashes when env vars are not yet populated on Vercel
export const gatewayDb: SupabaseClient = createClient(
  isConfigured ? supabaseUrl! : "https://placeholder-gateway.supabase.co",
  isConfigured ? supabaseAnonKey! : "placeholder-anon-key"
);
