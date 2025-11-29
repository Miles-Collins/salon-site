import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Lazy singleton to avoid multiple instantiations in edge/server/client splits.
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    if (!url || !anon) {
      throw new Error('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }
    client = createClient(url, anon, {
      auth: { persistSession: false }
    });
  }
  return client;
}
