import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const body = await request.json().catch(() => null) as {
    name: string;
    caption?: string | null;
    tags?: string[];
    display_order?: number | null;
    is_before_after?: boolean;
    before_image?: string | null;
  } | null;

  if (!body?.name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const { error } = await supabase.from("gallery_images").upsert({
    name: body.name,
    caption: body.caption ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    display_order: typeof body.display_order === "number" ? body.display_order : null,
    is_before_after: body.is_before_after ?? false,
    before_image: body.before_image ?? null,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
