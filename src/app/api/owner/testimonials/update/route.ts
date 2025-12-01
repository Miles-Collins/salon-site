import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { id, client_name, service, quote, rating, display_order, is_featured } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: any = {};
  if (client_name !== undefined) updates.client_name = client_name;
  if (service !== undefined) updates.service = service;
  if (quote !== undefined) updates.quote = quote;
  if (rating !== undefined) updates.rating = rating;
  if (display_order !== undefined) updates.display_order = display_order;
  if (is_featured !== undefined) updates.is_featured = is_featured;

  const { data, error } = await supabase
    .from("testimonials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ testimonial: data });
}
