import { NextResponse } from 'next/server';
import { parseCsv, ingestReport } from '../../../../lib/reportProcessing';
import { getSupabaseClient } from '../../../../lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { getAllowedEmails, isEmailAllowed } from '@/lib/authz';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const emails = user.emailAddresses?.map(e => e.emailAddress) || [];
    if (!isEmailAllowed(emails, getAllowedEmails())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get('file');
    const reportType = formData.get('reportType');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }
    if (reportType !== 'appointments' && reportType !== 'payments') {
      return NextResponse.json({ error: 'Invalid reportType' }, { status: 400 });
    }
    const text = await file.text();
    const parsed = parseCsv(text, reportType);
    const ownerId = user.id;
    const reportId = await ingestReport(parsed, file.name, ownerId);

    return NextResponse.json({ ok: true, reportId });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
