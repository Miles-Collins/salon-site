import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

export async function POST(req: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { client_name, service, quote, rating, display_order, is_featured } = body;

  if (!client_name || !quote) {
    return NextResponse.json({ error: "client_name and quote are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      client_name,
      service: service || null,
      quote,
      rating: rating || null,
      display_order: display_order || 0,
      is_featured: is_featured || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ testimonial: data });
}
