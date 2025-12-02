import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

type Announcement = { enabled?: boolean; text?: string };

export default async function AnnouncementBanner() {
  const hdrs = headers();
  const path = hdrs.get("x-invoke-path") || hdrs.get("next-url") || "";
  // Hide on owner/admin routes
  if (path?.startsWith("/owner")) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  try {
    const supabase = createClient(url, anon);
    const { data, error } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "announcement")
      .single();
    if (error) return null;
    const value = (data?.value || {}) as Announcement;
    if (!value?.enabled || !value?.text) return null;
    return (
      <div className="w-full border-y border-black/30 bg-white/15 backdrop-blur-sm">
        <div className="relative overflow-hidden">
          <div className="announcement-marquee whitespace-nowrap will-change-transform text-yellow-900 text-sm py-2">
            <span className="mx-8 text-white drop-shadow">{value.text}</span>
            <span className="mx-8">{value.text}</span>
            <span className="mx-8">{value.text}</span>
            <span className="mx-8">{value.text}</span>
          </div>
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
