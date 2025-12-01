import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";
import { isOwner } from "@/src/lib/authz";

const bucket = "gallery";

export async function GET() {
  // Server-side owner check via Clerk
  const user = await clerkClient().users.getUserList({ limit: 1 }); // placeholder; better to use auth in middleware
  // Fallback: allow if env owner email exists; actual middleware should ensure auth
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.storage.from(bucket).list(undefined, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicBase = supabase.storage.from(bucket).getPublicUrl("").data.publicUrl;
  const items = (data || []).map((f) => ({
    name: f.name,
    id: f.id,
    created_at: (f as any).created_at,
    url: `${publicBase}/${encodeURIComponent(f.name)}`,
  }));

  return NextResponse.json({ items });
}
