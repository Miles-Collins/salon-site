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
    <div className="space-y-4 md:space-y-6">
      {/* Upload Section */}
      <section className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Report</h2>
            <p className="text-sm text-gray-500">Import appointments or payments CSV</p>
          </div>
        </div>
        <form onSubmit={handleUpload} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="text-sm flex-1">
              <span className="sr-only">Report CSV File</span>
              <input aria-label="Report CSV File" type="file" name="file" accept=".csv" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </label>
            <label className="text-sm">
              <span className="sr-only">Report Type</span>
              <select aria-label="Report Type" name="reportType" className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="appointments">Appointments</option>
              <option value="payments">Payments</option>
              </select>
            </label>
            <button disabled={uploading} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
      </section>

      {metrics && (
        <>
          {/* KPI Cards Grid */}
          <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            <KpiCard title="This Month's Revenue" value={formatCurrency(metrics.kpis.thisMonthRevenue)} icon="💰" color="from-emerald-500 to-emerald-600" />
            <KpiCard title="This Week's Appointments" value={metrics.kpis.thisWeekAppointments.toString()} icon="📅" color="from-blue-500 to-blue-600" />
            <KpiCard title="Average Ticket" value={formatCurrency(metrics.kpis.averageTicket)} icon="💵" color="from-purple-500 to-purple-600" />
            <KpiCard title="Week New vs Ret." value={`${metrics.kpis.thisWeekNewClients}/${metrics.kpis.thisWeekReturningClients}`} icon="👥" color="from-pink-500 to-pink-600" />
            <KpiCard title="Month New vs Ret." value={`${metrics.kpis.thisMonthNewClients}/${metrics.kpis.thisMonthReturningClients}`} icon="📊" color="from-orange-500 to-orange-600" />
            <KpiCard title="Top Client Month Spend" value={formatCurrency(metrics.kpis.topClientSpendMonth)} icon="⭐" color="from-yellow-500 to-yellow-600" />
          </section>
          {/* Charts & Data Grid */}
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 md:gap-6">
            {/* Revenue Chart */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue (Last 6 Months)</h2>
              <div className="w-full h-48 sm:h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.monthRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip formatter={(v: any) => formatCurrency(v as number)} contentStyle={{ borderRadius: '8px', border: '1px solid #ddd' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ fill: '#0d9488', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Top Clients Card */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Clients (All-Time)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b-2 border-gray-200">
                      <th className="py-3 font-semibold text-gray-700">Client</th>
                      <th className="py-3 font-semibold text-gray-700 text-right">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {metrics.topClients.map(c => (
                      <tr key={c.client_id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-gray-900">{c.client_name || c.client_id}</td>
                        <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(c.total_spend)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Appointments Table */}
          <section className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b-2 border-gray-200">
                    <th className="py-2 md:py-3 font-semibold text-gray-700 text-xs md:text-sm">Date</th>
                    <th className="py-2 md:py-3 font-semibold text-gray-700 text-xs md:text-sm">Service</th>
                    <th className="py-2 md:py-3 font-semibold text-gray-700 text-xs md:text-sm">Client</th>
                    <th className="py-2 md:py-3 font-semibold text-gray-700 text-right text-xs md:text-sm">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {metrics.recentAppointments.map((a, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 md:py-3 text-gray-900 text-xs md:text-sm">{new Date(a.start_time).toLocaleString()}</td>
                      <td className="py-2 md:py-3 text-gray-900 text-xs md:text-sm">{a.service_name}</td>
                      <td className="py-2 md:py-3 text-gray-900 text-xs md:text-sm">{a.client_name}</td>
                      <td className="py-2 md:py-3 text-right font-medium text-gray-900 text-xs md:text-sm">{a.price != null ? formatCurrency(a.price) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* GlossGenius Link */}
          <div className="flex justify-center">
            <a
              href={process.env.NEXT_PUBLIC_GLOSS_GENIUS_DASHBOARD_URL || 'https://app.glossgenius.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Full GlossGenius Dashboard
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ title, value, icon, color }: { title: string; value: string; icon?: string; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">{title}</span>
        {icon && (
          <span className="text-2xl" role="img" aria-label="icon">{icon}</span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${color || 'from-gray-700 to-gray-900'}">{value}</span>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}
