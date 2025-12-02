import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase service role key not configured" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, serviceKey);
  const body = await request.json().catch(() => null) as { key?: string; value?: any } | null;
  if (!body?.key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }
  const { error } = await supabase.from("site_content").upsert({ key: body.key, value: body.value ?? {} });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
