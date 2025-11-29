"use client";
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Metrics {
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

export default function DashboardClient() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function fetchMetrics() {
    setError(null);
    const res = await fetch('/api/owner/metrics');
    const data = await res.json();
    if (data.error) setError(data.error); else setMetrics(data);
  }

  useEffect(() => { fetchMetrics(); }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector<HTMLInputElement>('input[name="file"]');
    const typeSelect = form.querySelector<HTMLSelectElement>('select[name="reportType"]');
    if (!fileInput?.files?.[0] || !typeSelect?.value) return;
    const fd = new FormData();
    fd.append('file', fileInput.files[0]);
    fd.append('reportType', typeSelect.value);
    setUploading(true);
    try {
      const res = await fetch('/api/owner/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Upload failed');
      await fetchMetrics();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      form.reset();
    }
  }

  return (
    <div className="space-y-8">
      <section className="border rounded p-4 bg-white shadow">
        <h2 className="font-semibold mb-3">Upload Latest Report</h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <div className="flex gap-2 items-center">
            <label className="text-sm flex-1">
              <span className="sr-only">Report CSV File</span>
              <input aria-label="Report CSV File" type="file" name="file" accept=".csv" className="flex-1" required />
            </label>
            <label className="text-sm">
              <span className="sr-only">Report Type</span>
              <select aria-label="Report Type" name="reportType" className="border rounded px-2 py-1" required>
              <option value="appointments">Appointments</option>
              <option value="payments">Payments</option>
              </select>
            </label>
            <button disabled={uploading} className="bg-black text-white px-4 py-2 rounded">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </section>

      {metrics && (
        <>
          <section className="grid md:grid-cols-6 gap-4">
            <KpiCard title="This Month's Revenue" value={formatCurrency(metrics.kpis.thisMonthRevenue)} />
            <KpiCard title="This Week's Appointments" value={metrics.kpis.thisWeekAppointments.toString()} />
            <KpiCard title="Average Ticket" value={formatCurrency(metrics.kpis.averageTicket)} />
            <KpiCard title="Week New vs Ret." value={`${metrics.kpis.thisWeekNewClients}/${metrics.kpis.thisWeekReturningClients}`} />
            <KpiCard title="Month New vs Ret." value={`${metrics.kpis.thisMonthNewClients}/${metrics.kpis.thisMonthReturningClients}`} />
            <KpiCard title="Top Client Month Spend" value={formatCurrency(metrics.kpis.topClientSpendMonth)} />
          </section>
          <section className="border rounded p-4 bg-white shadow">
            <h2 className="font-semibold mb-3">Top Clients (All-Time Spend)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Client</th>
                  <th className="py-1">Total Spend</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topClients.map(c => (
                  <tr key={c.client_id} className="border-b last:border-b-0">
                    <td className="py-1">{c.client_name || c.client_id}</td>
                    <td className="py-1">{formatCurrency(c.total_spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="border rounded p-4 bg-white shadow">
            <h2 className="font-semibold mb-3">Revenue (Last 6 Months)</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.monthRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v: any) => formatCurrency(v as number)} />
                  <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="border rounded p-4 bg-white shadow">
            <h2 className="font-semibold mb-3">Upcoming / Recent Appointments</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1">Date</th>
                  <th className="py-1">Service</th>
                  <th className="py-1">Client</th>
                  <th className="py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentAppointments.map((a, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="py-1">{new Date(a.start_time).toLocaleString()}</td>
                    <td className="py-1">{a.service_name}</td>
                    <td className="py-1">{a.client_name}</td>
                    <td className="py-1">{a.price != null ? formatCurrency(a.price) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div>
            <a
              href={process.env.NEXT_PUBLIC_GLOSS_GENIUS_DASHBOARD_URL || 'https://app.glossgenius.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              Open Full GlossGenius Dashboard
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded p-4 bg-white shadow flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500">{title}</span>
      <span className="text-2xl font-semibold mt-2">{value}</span>
    </div>
  );
}

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
