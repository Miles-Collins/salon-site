import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isOwner } from "@/lib/authz";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();
  const { question, answer, display_order, is_published, category } = body;

  if (!question || !answer) {
    return NextResponse.json({ error: "question and answer are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question,
      answer,
      display_order: display_order || 0,
      is_published: is_published ?? true,
      category: category || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ faq: data });
}
