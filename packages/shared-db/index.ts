import { createClient } from '@supabase/supabase-js';

export const DB_SCHEMA = 'public';

export function getTenantQuery(tenantId: string) {
  return { tenant_id: tenantId };
}

export function createSupabaseClient(url?: string, key?: string) {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = key || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key');
  }

  return createClient(supabaseUrl, supabaseKey);
}
