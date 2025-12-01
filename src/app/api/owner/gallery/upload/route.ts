import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

const bucket = "gallery";

export async function POST(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const name = (formData.get("filename") as string | null) || `${Date.now()}-${file.name}`;
  const caption = (formData.get("caption") as string | null) || null;
  const tagsRaw = (formData.get("tags") as string | null) || ""; // comma-separated
  const displayOrderStr = (formData.get("display_order") as string | null) || null;
  const displayOrder = displayOrderStr !== null ? parseInt(displayOrderStr, 10) : null;
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage.from(bucket).upload(name, arrayBuffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insert metadata row
  await supabase.from("gallery_images").upsert({
    name,
    caption,
    tags,
    display_order: Number.isFinite(displayOrder as any) ? displayOrder : null,
  });

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
  return NextResponse.json({ name, url: publicUrl, caption, tags, display_order: displayOrder });
}
