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
  const { id, question, answer, display_order, is_published, category } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: any = { updated_at: new Date().toISOString() };
  if (question !== undefined) updates.question = question;
  if (answer !== undefined) updates.answer = answer;
  if (display_order !== undefined) updates.display_order = display_order;
  if (is_published !== undefined) updates.is_published = is_published;
  if (category !== undefined) updates.category = category;

  const { data, error } = await supabase
    .from("faqs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ faq: data });
}
