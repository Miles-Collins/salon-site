import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

const bucket = "gallery";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  // Use service role key for avatar uploads to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const filename = (formData.get("filename") as string | null) || `avatar-${Date.now()}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(filename, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
  return NextResponse.json({ url: publicUrl });
}
