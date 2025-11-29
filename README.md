This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Owner Dashboard (/owner/dashboard)

This project now includes an owner-only dashboard for uploading GlossGenius CSV reports (Appointments & Payments) and viewing KPIs + charts.

### 1. Install New Dependencies

```cmd
npm install
```

Added packages: `@supabase/supabase-js`, `papaparse`, `recharts`, `zod`, `@clerk/nextjs`, `@types/papaparse`.

### 2. Supabase Setup
1. Create a new Supabase project.
2. In the SQL editor run `supabase-schema.sql` from repo root.
3. Create a service role key (copy) and set env vars in `.env.local`:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY` (only needed for privileged server ops; currently unused but reserved).

### 3. Clerk (Authentication)
1. Create a Clerk application.
2. Set env vars:
	- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
	- `CLERK_SECRET_KEY`
3. Restrict access to specific emails (owner allowlist):
	- Set `OWNER_ALLOWED_EMAILS` to a comma-separated list, e.g.
	  `OWNER_ALLOWED_EMAILS=owner@gmail.com,sister@gmail.com`
	- `OWNER_ALLOWED_EMAIL` is still supported (single email).
	 - For client-side gate (UI redirect), also set public vars:
		 - `NEXT_PUBLIC_OWNER_ALLOWED_EMAILS` (same list)
		 - or `NEXT_PUBLIC_OWNER_ALLOWED_EMAIL` (single email)
4. Visit `/owner/dashboard` while signed in. Without Clerk keys, the page will still render (development convenience).

### 4. Upload Flow
1. Export CSV from GlossGenius (Appointments or Payments report).
2. In `/owner/dashboard` use the Upload Latest Report section.
3. Backend route: `POST /api/owner/upload` parses CSV via PapaParse and upserts rows into `appointments` or `payments` tables.

### 5. Metrics Computed
- This Month's Revenue: Sum of `payments.amount` for current calendar month.
- This Week's Appointments: Count of `appointments` in last 7 days.
- Average Ticket: (Revenue from this weeks appointments) / (Appointment count).
- Revenue (Last 6 Months): Line chart aggregating payment totals by month.
- Upcoming / Recent Appointments: Earliest 10 appointments ordered by `start_time`.
- New vs Returning Clients (Week/Month): Derived from first appearance of `client_id` in `appointments` vs existing `clients` table.
- Top Client Month Spend: Highest cumulative spend for a single client within current month.
- Top Clients (All-Time Spend): Table ordered by `clients.total_spend` (top 5).

### 6. GlossGenius Deep Link
Button links to `GLOSS_GENIUS_DASHBOARD_URL` (defaults to `https://app.glossgenius.com`). Override in `.env.local`.

### 7. Future Enhancements
- Distinguish new vs returning clients (needs client history — add client table ingest if present in CSV).
- Persist client loyalty metrics (total spend) via payments rollup.
- Add rolling 90-day spend trend per top client.
- Optimize client spend updates with Postgres functions to reduce per-row round trips.
- Incremental metrics materialization (use `metrics_daily` table).
- Error & success toast notifications.
- Role-based auth guard with Clerk server-side middleware.
- Storage of raw CSV in Supabase Storage for audit.
- Automatic detection of report type from headers.

### 8. Troubleshooting
- "Cannot find module" errors: Run `npm install` after pulling changes.
- Empty metrics: Upload at least one payments CSV.
- Timezone issues: Ensure GlossGenius export includes ISO timestamps; adjust parsing if needed.

### 9. Dev Commands
```cmd
npm run dev
```
Open `http://localhost:3000/owner/dashboard`.

---
