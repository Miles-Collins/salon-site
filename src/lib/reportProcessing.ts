import Papa from 'papaparse';
import { getSupabaseClient } from './supabase';

// Minimal database table interfaces for Supabase typing workaround
interface ReportRow { id: string; }

// Define lightweight table row types to help Supabase generics avoid 'never'
type ClientRecord = {
  client_id: string;
  client_name: string | null;
  first_seen: string | null;
  last_seen: string | null;
  total_appointments: number | null;
};

type AppointmentRecord = {
  source_report: string;
  appointment_id: string;
  start_time: string;
  end_time: string | null;
  service_name: string | null;
  client_name: string | null;
  client_id: string | null;
  is_new_client: boolean;
  price: number | null;
};

type PaymentRecord = {
  source_report: string;
  payment_id: string;
  payment_time: string;
  amount: number | null;
  method: string | null;
  client_id: string | null;
  service_name: string | null;
};

export type AppointmentRow = {
  appointment_id: string;
  start_time: string; // ISO
  end_time?: string;
  service_name?: string;
  client_name?: string;
  client_id?: string;
  is_new_client?: string; // 'TRUE'/'FALSE' maybe
  price?: string; // numeric string
};

export type PaymentRow = {
  payment_id: string;
  payment_time: string;
  amount: string;
  method?: string;
  client_id?: string;
  service_name?: string;
};

export interface ParsedReport {
  reportType: 'appointments' | 'payments';
  appointments?: AppointmentRow[];
  payments?: PaymentRow[];
}

export function parseCsv(content: string, reportType: ParsedReport['reportType']): ParsedReport {
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  const data = result.data as any[];
  if (reportType === 'appointments') {
    return { reportType, appointments: data as AppointmentRow[] };
  }
  return { reportType, payments: data as PaymentRow[] };
}

export async function ingestReport(parsed: ParsedReport, originalFilename: string, ownerId?: string) {
  const supabase = getSupabaseClient();
  const { data: report, error: repErr } = await (supabase as any)
    .from('reports')
    .insert({ original_filename: originalFilename, report_type: parsed.reportType, owner_id: ownerId, raw_csv: null })
    .select()
    .single();
  if (repErr) throw repErr;
  const source_report: string = (report as any).id;

  if (parsed.reportType === 'appointments' && parsed.appointments) {
    // Normalize appointment rows
    const apptRows: Omit<AppointmentRecord, 'is_new_client'>[] = parsed.appointments.map(r => ({
      source_report,
      appointment_id: r.appointment_id,
      start_time: r.start_time,
      end_time: r.end_time || null,
      service_name: r.service_name || null,
      client_name: r.client_name || null,
      client_id: r.client_id || null,
      price: r.price ? Number(r.price) : null
    }));

    // Determine new vs returning clients based on clients table
    const clientIds = Array.from(new Set(apptRows.map(a => a.client_id).filter(Boolean))) as string[];
    let existingClientIds: Set<string> = new Set();
    if (clientIds.length) {
      const { data: existingClients, error: clientQueryErr } = await (supabase as any)
        .from('clients')
        .select('client_id')
        .in('client_id', clientIds);
      if (clientQueryErr) throw clientQueryErr;
      existingClientIds = new Set((existingClients as ClientRecord[] | null)?.map(c => c.client_id));
    }

    const nowISO = new Date().toISOString();
    const newClientUpserts: ClientRecord[] = clientIds
      .filter(id => !existingClientIds.has(id))
      .map(id => ({ client_id: id, client_name: apptRows.find(a => a.client_id === id)?.client_name || null, first_seen: nowISO, last_seen: nowISO, total_appointments: 1 }));

    // Update existing clients last_seen and increment total_appointments
    const existingClientUpdates = clientIds.filter(id => existingClientIds.has(id));
    for (const id of existingClientUpdates) {
      // Fetch current total to increment (simpler approach; could use RPC for atomicity)
      const { data: existing, error: fetchErr } = await (supabase as any).from('clients').select('total_appointments').eq('client_id', id).single();
      if (fetchErr) throw fetchErr;
      const newTotal = ((existing as any)?.total_appointments || 0) + apptRows.filter(a => a.client_id === id).length;
      const { error: updateErr } = await (supabase as any)
        .from('clients')
        .update({ last_seen: nowISO, total_appointments: newTotal })
        .eq('client_id', id);
      if (updateErr) throw updateErr;
    }
    if (newClientUpserts.length) {
      const { error: insertErr } = await (supabase as any).from('clients').upsert(newClientUpserts, { onConflict: 'client_id' });
      if (insertErr) throw insertErr;
    }

    const appointmentRowsWithFlag: AppointmentRecord[] = apptRows.map(a => ({
      ...a,
      is_new_client: a.client_id ? !existingClientIds.has(a.client_id) : false
    }));

    if (appointmentRowsWithFlag.length) {
      const { error } = await (supabase as any).from('appointments').upsert(appointmentRowsWithFlag, { onConflict: 'appointment_id' });
      if (error) throw error;
    }
  }

  if (parsed.reportType === 'payments' && parsed.payments) {
    const rows: PaymentRecord[] = parsed.payments.map(r => ({
      source_report,
      payment_id: r.payment_id,
      payment_time: r.payment_time,
      amount: r.amount ? Number(r.amount) : null,
      method: r.method || null,
      client_id: r.client_id || null,
      service_name: r.service_name || null
    }));
    if (rows.length) {
      const { error } = await (supabase as any).from('payments').upsert(rows, { onConflict: 'payment_id' });
      if (error) throw error;

      // Update client spend totals
      const spendMap = new Map<string, number>();
      rows.forEach(r => {
        if (r.client_id && r.amount) {
          spendMap.set(r.client_id, (spendMap.get(r.client_id) || 0) + r.amount);
        }
      });
      for (const [clientId, incr] of spendMap.entries()) {
        // Fetch existing to increment; could be optimized with RPC
        const { data: existing, error: fetchErr } = await (supabase as any)
          .from('clients')
          .select('total_spend,total_appointments')
          .eq('client_id', clientId)
          .single();
        if (fetchErr && fetchErr.code !== 'PGRST116') throw fetchErr; // ignore not found
        if (!existing) {
          const nowISO = new Date().toISOString();
          const { error: insertErr } = await (supabase as any)
            .from('clients')
            .upsert({ client_id: clientId, client_name: null, first_seen: nowISO, last_seen: nowISO, total_appointments: 0, total_spend: incr }, { onConflict: 'client_id' });
          if (insertErr) throw insertErr;
        } else {
          const newSpend = ((existing as any).total_spend || 0) + incr;
          const { error: updateErr } = await (supabase as any)
            .from('clients')
            .update({ total_spend: newSpend, last_seen: new Date().toISOString() })
            .eq('client_id', clientId);
          if (updateErr) throw updateErr;
        }
      }
    }
  }

  await (supabase as any).from('reports').update({ processed: true }).eq('id', source_report);
  return source_report;
}

export interface Metrics {
  monthRevenue: { month: string; revenue: number }[];
  recentAppointments: { start_time: string; service_name: string; client_name: string; price: number | null }[];
  kpis: {
    thisMonthRevenue: number;
    thisWeekAppointments: number;
    averageTicket: number;
    thisWeekNewClients: number;
    thisWeekReturningClients: number;
    thisMonthNewClients: number;
    thisMonthReturningClients: number;
    topClientSpendMonth: number;
  };
  topClients: { client_id: string; client_name: string; total_spend: number }[];
}

export async function computeMetrics(): Promise<Metrics> {
  const supabase = getSupabaseClient();
  // Revenue by month (last 6 months)
  const { data: payments }: { data: { amount: number | null; payment_time: string }[] | null } = await supabase
    .from('payments')
    .select('amount,payment_time')
    .gte('payment_time', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

  const monthMap = new Map<string, number>();
  payments?.forEach((p: { amount: number | null; payment_time: string }) => {
    const d = new Date(p.payment_time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(key, (monthMap.get(key) || 0) + (p.amount || 0));
  });
  const monthRevenue = Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, revenue]) => ({ month, revenue }));

  // Appointments recent (next/upcoming or latest uploaded sorted by start_time desc)
  const { data: appts }: { data: { start_time: string; service_name: string | null; client_name: string | null; price: number | null }[] | null } = await supabase
    .from('appointments')
    .select('start_time,service_name,client_name,price')
    .order('start_time', { ascending: true })
    .limit(10);

  // KPI calculations
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();

  const { data: thisMonthPayments }: { data: { amount: number | null }[] | null } = await supabase
    .from('payments')
    .select('amount')
    .gte('payment_time', monthStart);
  const thisMonthRevenue = thisMonthPayments?.reduce((sum: number, p: { amount: number | null }) => sum + (p.amount || 0), 0) || 0;

  const { data: thisWeekAppts }: { data: { price: number | null; start_time: string; client_id: string | null; is_new_client: boolean | null }[] | null } = await supabase
    .from('appointments')
    .select('price,start_time,client_id,is_new_client')
    .gte('start_time', weekStart);
  const thisWeekAppointments = thisWeekAppts?.length || 0;
  // New vs Returning (week)
  const thisWeekNewClients = thisWeekAppts?.filter(a => a.is_new_client).length || 0;
  const thisWeekReturningClients = thisWeekAppointments - thisWeekNewClients;

  // Month new vs returning
  const { data: thisMonthAppts }: { data: { client_id: string | null; is_new_client: boolean | null; start_time: string }[] | null } = await supabase
    .from('appointments')
    .select('client_id,is_new_client,start_time')
    .gte('start_time', monthStart);
  const thisMonthNewClients = thisMonthAppts?.filter(a => a.is_new_client).length || 0;
  const thisMonthReturningClients = (thisMonthAppts?.length || 0) - thisMonthNewClients;

  // Top clients overall & month spend
  const { data: clients }: { data: { client_id: string; client_name: string | null; total_spend: number | null }[] | null } = await (supabase as any)
    .from('clients')
    .select('client_id,client_name,total_spend')
    .order('total_spend', { ascending: false })
    .limit(5);
  const topClients = (clients || []).map(c => ({ client_id: c.client_id, client_name: c.client_name || '', total_spend: c.total_spend || 0 }));

  // Month spend for top client (highest spender among those with payments this month)
  const { data: monthClientPayments }: { data: { client_id: string | null; amount: number | null }[] | null } = await (supabase as any)
    .from('payments')
    .select('client_id,amount')
    .gte('payment_time', monthStart);
  const monthSpendMap = new Map<string, number>();
  monthClientPayments?.forEach(p => { if (p.client_id && p.amount) monthSpendMap.set(p.client_id, (monthSpendMap.get(p.client_id) || 0) + p.amount); });
  let topClientSpendMonth = 0;
  monthSpendMap.forEach(v => { if (v > topClientSpendMonth) topClientSpendMonth = v; });

  const totalRevenue = thisWeekAppts?.reduce((sum: number, a: { price: number | null }) => sum + (a.price || 0), 0) || 0;
  const averageTicket = thisWeekAppointments ? totalRevenue / thisWeekAppointments : 0;

  return {
    monthRevenue,
    recentAppointments: (appts || []).map(a => ({
      start_time: a.start_time,
      service_name: a.service_name || '',
      client_name: a.client_name || '',
      price: a.price
    })),
    kpis: { thisMonthRevenue, thisWeekAppointments, averageTicket, thisWeekNewClients, thisWeekReturningClients, thisMonthNewClients, thisMonthReturningClients, topClientSpendMonth },
    topClients
  };
}
