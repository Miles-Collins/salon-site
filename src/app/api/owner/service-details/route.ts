import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { isOwner } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("service_details")
    .select("*")
    .order("category", { ascending: true })
    .order("service_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("service_details")
    .insert([body])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
