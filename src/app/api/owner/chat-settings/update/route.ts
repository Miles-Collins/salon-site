import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { greeting_message, reply_time_text, avatar_url } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);

    const settings = {
      greeting_message: greeting_message || "👋 Hi! I'm Porscha. Have questions about services, pricing, or availability? Send me a message!",
      reply_time_text: reply_time_text || "Typically replies within hours",
      avatar_url: avatar_url || null,
    };

    const { error } = await supabase
      .from("site_content")
      .upsert({
        key: "chat_widget_settings",
        value: settings,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "key"
      });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Update chat settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
