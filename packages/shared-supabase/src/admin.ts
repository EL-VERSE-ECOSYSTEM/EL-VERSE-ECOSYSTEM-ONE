import "server-only";
import { createClient } from "@supabase/supabase-js";

export const createSupabaseAdminClient = () => {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) throw new Error("Missing Supabase admin env vars");

  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
