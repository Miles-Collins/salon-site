import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Lazy singleton to avoid multiple instantiations in edge/server/client splits.
let client: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseClient() {
  if (!client) {
    if (!url || !anon) {
      // During build without env vars, return a mock client that throws on use
      // This prevents build failures while still erroring at runtime if actually used
      return {
        from: () => {
          throw new Error('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
        }
      } as any;
    }
    client = createClient<any>(url, anon, {
      auth: { persistSession: false }
    });
  }
  return client;
}
