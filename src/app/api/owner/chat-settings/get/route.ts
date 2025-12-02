import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { settings: null },
        { status: 200 }
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "chat_widget_settings")
      .single();

    if (data?.value) {
      return NextResponse.json({ settings: data.value });
    }

    // Return defaults if not found
    return NextResponse.json({
      settings: {
        greeting_message: "👋 Hi! I'm Porscha. Have questions about services, pricing, or availability? Send me a message!",
        reply_time_text: "Typically replies within hours",
        avatar_url: null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch chat settings:", error);
    return NextResponse.json(
      { settings: null },
      { status: 500 }
    );
  }
}
