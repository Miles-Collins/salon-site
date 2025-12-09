import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const GALLERY_BUCKET = "gallery";
const TRANSFORMATIONS_BUCKET = "gallery-transformations";
const SERVICES_BUCKET = "gallery-services";

export const dynamic = 'force-dynamic';

export async function GET() {
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

  // Debug: log what we got from each bucket
  console.log("Gallery items:", galleryRes.data?.length || 0, "error:", galleryRes.error?.message);
  console.log("Transformations items:", transformationsRes.data?.length || 0, "error:", transformationsRes.error?.message);
  console.log("Services items:", servicesRes.data?.length || 0, "error:", servicesRes.error?.message);

  const galleryPublicBase = supabase.storage.from(GALLERY_BUCKET).getPublicUrl("").data.publicUrl;
  const transformationsPublicBase = supabase.storage.from(TRANSFORMATIONS_BUCKET).getPublicUrl("").data.publicUrl;
  const servicesPublicBase = supabase.storage.from(SERVICES_BUCKET).getPublicUrl("").data.publicUrl;

  // Fetch metadata rows
  const { data: metaRows } = await supabase
    .from("gallery_images")
    .select("name, caption, tags, display_order, created_at, is_before_after, before_image, bucket");
  const metaMap = new Map((metaRows || []).map((m) => [m.name, m]));

  // If transformations bucket list is empty but metadata has transformation items, use metadata as source
  let transformationItems = transformationsRes.data || [];
  if (transformationItems.length === 0 && metaRows) {
    const transformationMetaItems = metaRows.filter((m) => m.bucket === TRANSFORMATIONS_BUCKET);
    if (transformationMetaItems.length > 0) {
      console.log(`Transformations bucket list was empty, but found ${transformationMetaItems.length} items in metadata table`);
      transformationItems = transformationMetaItems.map((m) => ({ name: m.name }));
    }
  }

  const items = [
    ...(galleryRes.data || []).map((f) => ({ ...f, bucket: GALLERY_BUCKET })),
    ...transformationItems.map((f) => ({ ...f, bucket: TRANSFORMATIONS_BUCKET })),
    ...(servicesRes.data || []).map((f) => ({ ...f, bucket: SERVICES_BUCKET })),
  ]
    // ignore storage helper files
    .filter((f: any) => !f.name?.startsWith("."))
    .map((f: any) => {
      const meta = metaMap.get(f.name);
      const bucketName = meta?.bucket || f.bucket;
      let publicBase = galleryPublicBase;
      if (bucketName === TRANSFORMATIONS_BUCKET) publicBase = transformationsPublicBase;
      if (bucketName === SERVICES_BUCKET) publicBase = servicesPublicBase;
      
      return {
        name: f.name,
        created_at: (meta?.created_at as any) || (f as any).created_at,
        url: `${publicBase}${encodeURIComponent(f.name)}`,
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
