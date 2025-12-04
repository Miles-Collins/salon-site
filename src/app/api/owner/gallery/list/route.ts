import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

const bucket = "gallery";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Server-side owner check
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

  // Fetch metadata rows
  const { data: metaRows } = await supabase
    .from("gallery_images")
    .select("name, caption, tags, display_order, created_at, is_before_after, before_image");
  const metaMap = new Map((metaRows || []).map((m) => [m.name, m]));

  const items = (data || [])
    .map((f) => {
      const meta = metaMap.get(f.name);
      return {
        name: f.name,
        created_at: (meta?.created_at as any) || (f as any).created_at,
        url: `${publicBase}/${encodeURIComponent(f.name)}`,
        caption: meta?.caption || null,
        tags: meta?.tags || [],
        display_order: meta?.display_order ?? null,
        is_before_after: meta?.is_before_after || false,
        before_image: meta?.before_image || null,
      };
    })
    .sort((a, b) => {
      const ao = a.display_order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.display_order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return NextResponse.json({ items });
}
