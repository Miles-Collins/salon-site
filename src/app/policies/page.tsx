import Section from "@/components/Section";
import { createClient } from "@supabase/supabase-js";
import React from "react";

export const dynamic = "force-dynamic";

async function getPoliciesMarkdown() {
  // If env vars are missing (e.g., during build without Supabase), return undefined
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return undefined;
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "policies")
    .limit(1)
    .single();
  return (data?.value as any)?.markdown as string | undefined;
}

export default async function PoliciesPage() {
  const md = await getPoliciesMarkdown();
  return (
    <Section>
      <h1 className="h2">Policies</h1>
      {md ? (
        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: md }} />
      ) : (
        <div className="mt-6 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Cancellations</h3>
            <p className="mt-2 text-sm text-black/70">
              Please cancel or reschedule at least 24 hours in advance to avoid a fee.
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Late Arrivals</h3>
            <p className="mt-2 text-sm text-black/70">More than 10 minutes late may require rescheduling.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">No-Show</h3>
            <p className="mt-2 text-sm text-black/70">No-shows may be charged up to 100% of the service.</p>
          </div>
        </div>
      )}
    </Section>
  );
}
