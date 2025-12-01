import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.from("site_content").select("key, value, updated_at");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const map: Record<string, any> = {};
  (data || []).forEach((row) => (map[row.key] = row.value));
  return NextResponse.json({ content: map });
}
