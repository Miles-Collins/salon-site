export function supabaseThumb(url: string, width = 400, quality = 70) {
  // If URL is a Supabase public object URL, append transform params
  // Example: https://<project>.supabase.co/storage/v1/object/public/gallery/<name>?width=400&quality=70
  try {
    const u = new URL(url, "http://dummy");
    const hasStorage = u.pathname.includes("/storage/v1/object/public/");
    if (!hasStorage) return url;
    const out = new URL(url);
    out.searchParams.set("width", String(width));
    out.searchParams.set("quality", String(quality));
    return out.toString();
  } catch {
    return url;
  }
}
