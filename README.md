**Salon Site** is a Next.js App Router project for Porscha’s Salon with a public marketing site, booking links, gallery, policies, and an owner-only dashboard for uploading GlossGenius reports and viewing business metrics.

**Stack**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres) for data + SQL in `supabase-schema.sql`
- Clerk (auth) with owner allowlist
- CSV parsing via PapaParse; charts via Recharts; validation via Zod

**Quick Start**
- Install: `npm install`
- Dev: `npm run dev` then visit `http://localhost:3000`
- Owner dashboard: `http://localhost:3000/owner/dashboard` (requires auth/allowlist)

**Environment Variables**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Optional service role (server-only)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `OWNER_ALLOWED_EMAILS`: Comma-separated owner emails (server)
- `NEXT_PUBLIC_OWNER_ALLOWED_EMAILS`: Comma-separated owner emails (client)
  - Single-value variants also supported: `OWNER_ALLOWED_EMAIL`, `NEXT_PUBLIC_OWNER_ALLOWED_EMAIL`

Create a `.env.local` in the repo root and populate the above before running locally.

**Supabase Setup**
- Create a Supabase project, open SQL editor, run `supabase-schema.sql` from repo root.
- Tables include `appointments`, `payments`, and derived metrics helpers.

**Auth (Clerk) & Owner Gate**
- Create a Clerk application and set the Clerk env vars.
- Restrict access by setting `OWNER_ALLOWED_EMAILS` and `NEXT_PUBLIC_OWNER_ALLOWED_EMAILS`.
- The owner area uses `src/app/owner/layout.tsx` and client gate in `src/app/owner/dashboard/ui/OwnerGate.tsx`.

**Upload & Metrics**
- Upload GlossGenius CSVs (Appointments or Payments) in `/owner/dashboard`.
- API route `POST /api/owner/upload` ingests CSV and upserts into Supabase.
- KPIs computed and displayed in `src/app/owner/dashboard/page.tsx` using helpers in `src/lib/reportProcessing.ts`.

**Gallery Curation**
- Supabase Storage bucket: `gallery` (public read recommended)
- Metadata table: `gallery_images` (run from `supabase-schema.sql`)
  - Columns: `name` (PK, storage filename), `caption`, `tags text[]`, `display_order int`, `created_at timestamptz`
- Owner dashboard widget: `GalleryManager.tsx` lets you upload, set caption, tags, and display order, and delete.
- API endpoints:
  - `GET /api/owner/gallery/list` — returns storage files merged with metadata, sorted by `display_order` then `created_at`.
  - `POST /api/owner/gallery/upload` — multipart upload with optional `caption`, `tags` (comma-separated), `display_order`.
  - `POST /api/owner/gallery/update` — update `caption`, `tags`, `display_order` for `name`.
  - `POST /api/owner/gallery/delete` — remove storage object and metadata row.
- Public page `src/app/gallery/page.tsx` prefers Supabase data and falls back to `public/gallery`.

**Key Paths**
- `src/app/page.tsx`: Home page
- `src/app/services/page.tsx`: Services
- `src/app/gallery/page.tsx`: Gallery (uses images under `public/gallery/`)
- `src/app/policies/page.tsx`: Policies
- `src/app/book/page.tsx`: Booking CTA
- `src/app/owner/dashboard/page.tsx`: Owner dashboard
- `src/app/api/owner/upload/route.ts`: CSV ingest API
- `src/app/api/owner/metrics/route.ts`: Metrics API
- `src/lib/supabase.ts`: Supabase client
- `src/lib/authz.ts`: Owner authorization helpers

**Run Locally**
```cmd
npm install
npm run dev
```
Visit `http://localhost:3000`.

**Deploy**
- Vercel recommended. Add env vars to the Vercel project.
- Ensure Supabase and Clerk are configured in the deployed environment.

**Troubleshooting**
- Missing modules: run `npm install` after pulling.
- Metrics empty: upload a Payments CSV via dashboard.
- Timezone parsing: ensure exports include ISO timestamps; adjust parser in `reportProcessing.ts` if needed.

**Project Goals / Roadmap**
- Enrich client history to distinguish new vs returning clients.
- Materialize rolling daily metrics to improve dashboard performance.
- Store raw CSVs in Supabase Storage for auditing.
- Harden server-side auth checks and error handling.
