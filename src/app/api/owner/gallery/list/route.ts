import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

const GALLERY_BUCKET = "gallery";
const TRANSFORMATIONS_BUCKET = "gallery-transformations";
const SERVICES_BUCKET = "gallery-services";

export const dynamic = 'force-dynamic';

export async function GET() {
  // Server-side owner check
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return NextResponse.json({ error: "Supabase service role key not configured" }, { status: 500 });
  }

  // Use service role to bypass RLS for listing owner gallery
  const supabase = createClient(supabaseUrl, serviceKey);

  // List all three buckets in parallel
  const [galleryRes, transformationsRes, servicesRes] = await Promise.all([
    supabase.storage.from(GALLERY_BUCKET).list(undefined, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    }),
    supabase.storage.from(TRANSFORMATIONS_BUCKET).list(undefined, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    }),
    supabase.storage.from(SERVICES_BUCKET).list(undefined, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    }),
  ]);

  if (galleryRes.error && transformationsRes.error && servicesRes.error) {
    return NextResponse.json({ error: "Failed to list gallery" }, { status: 500 });
  }

  const galleryPublicBase = supabase.storage.from(GALLERY_BUCKET).getPublicUrl("").data.publicUrl;
  const transformationsPublicBase = supabase.storage.from(TRANSFORMATIONS_BUCKET).getPublicUrl("").data.publicUrl;
  const servicesPublicBase = supabase.storage.from(SERVICES_BUCKET).getPublicUrl("").data.publicUrl;

  // Fetch metadata rows
  const { data: metaRows } = await supabase
    .from("gallery_images")
    .select("name, caption, tags, display_order, created_at, is_before_after, before_image, bucket");
  const metaMap = new Map((metaRows || []).map((m) => [m.name, m]));

  const items = [
    ...(galleryRes.data || []).map((f) => ({ ...f, bucket: GALLERY_BUCKET })),
    ...(transformationsRes.data || []).map((f) => ({ ...f, bucket: TRANSFORMATIONS_BUCKET })),
    ...(servicesRes.data || []).map((f) => ({ ...f, bucket: SERVICES_BUCKET })),
  ]
    .map((f: any) => {
      const meta = metaMap.get(f.name);
      const bucketName = meta?.bucket || f.bucket;
      let publicBase = galleryPublicBase;
      if (bucketName === TRANSFORMATIONS_BUCKET) publicBase = transformationsPublicBase;
      if (bucketName === SERVICES_BUCKET) publicBase = servicesPublicBase;
      
      return {
        name: f.name,
        created_at: (meta?.created_at as any) || (f as any).created_at,
        url: `${publicBase}/${encodeURIComponent(f.name)}`,
        caption: meta?.caption || null,
        tags: meta?.tags || [],
        display_order: meta?.display_order ?? null,
        is_before_after: meta?.is_before_after || false,
        before_image: meta?.before_image || null,
        bucket: bucketName,
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
