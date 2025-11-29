import { NextResponse } from 'next/server';
import { computeMetrics } from '../../../../lib/reportProcessing';
import { currentUser } from '@clerk/nextjs/server';
import { getAllowedEmails, isEmailAllowed } from '@/lib/authz';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const emails = user.emailAddresses?.map(e => e.emailAddress) || [];
    if (!isEmailAllowed(emails, getAllowedEmails())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const metrics = await computeMetrics();
    return NextResponse.json(metrics);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
