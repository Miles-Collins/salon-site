import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send via Supabase notification or email service
    // For now, we'll store in a contact_messages table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
        is_read: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Continue anyway - don't fail the request
      }
    }

    // Optionally: Send email notification to Porscha
    // You could use Resend, SendGrid, or similar here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
