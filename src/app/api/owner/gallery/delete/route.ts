import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

const GALLERY_BUCKET = "gallery";
const TRANSFORMATIONS_BUCKET = "gallery-transformations";
const SERVICES_BUCKET = "gallery-services";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await request.json().catch(() => null) as { name?: string; bucket?: string } | null;
  if (!body?.name) {
    return NextResponse.json({ error: "Missing file name" }, { status: 400 });
  }

  // Determine bucket - use provided bucket or default to gallery
  const bucketName = body.bucket || GALLERY_BUCKET;

  const { error } = await supabase.storage.from(bucketName).remove([body.name]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
