-- Supabase schema for owner dashboard analytics
-- Run these in the SQL editor in Supabase.

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  original_filename text,
  report_type text not null, -- 'appointments' | 'payments'
  uploaded_at timestamptz default now(),
  processed boolean default false,
  owner_id text, -- optional clerk user id
  raw_csv text
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  source_report uuid references reports(id) on delete set null,
  appointment_id text, -- external id from CSV
  start_time timestamptz,
  end_time timestamptz,
  service_name text,
  client_name text,
  client_id text,
  is_new_client boolean,
  price numeric,
  created_at timestamptz default now(),
  unique (appointment_id)
);

-- Track distinct clients with first/last seen timestamps and aggregate counters
create table if not exists clients (
  client_id text primary key,
  client_name text,
  first_seen timestamptz,
  last_seen timestamptz,
  total_appointments int default 0,
  total_spend numeric default 0
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  source_report uuid references reports(id) on delete set null,
  payment_id text,
  payment_time timestamptz,
  amount numeric,
  method text,
  client_id text,
  service_name text,
  created_at timestamptz default now(),
  unique (payment_id)
);

-- Materialized metrics table (optional incremental approach)
create table if not exists metrics_daily (
  day date primary key,
  total_revenue numeric,
  appointment_count int,
  new_clients int,
  returning_clients int,
  average_ticket numeric
);

alter table clients add column if not exists total_spend numeric default 0;


-- Gallery curation metadata
create table if not exists public.gallery_images (
  name text primary key, -- matches storage object name
  caption text,
  tags text[] default '{}',
  display_order int default null, -- lower first; null means unsorted
  created_at timestamptz default now()
);

-- Add columns if they don't exist
alter table public.gallery_images add column if not exists is_before_after boolean default false;
alter table public.gallery_images add column if not exists before_image text;

create index if not exists gallery_images_order_created_idx
  on public.gallery_images (display_order asc nulls last, created_at desc);

create index if not exists gallery_images_before_after_idx
  on public.gallery_images (is_before_after) where is_before_after = true;

alter table public.gallery_images enable row level security;
do $$ begin
  create policy "gallery read" on public.gallery_images
    for select using (true);
exception when others then null; end $$;

-- Lightweight CMS content storage
create table if not exists public.site_content (
  key text primary key, -- e.g., 'hero', 'announcement', 'policies'
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_content enable row level security;
do $$ begin
  create policy "content read" on public.site_content
    for select using (true);
exception when others then null; end $$;

-- Testimonials for social proof
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  service text,
  quote text not null,
  rating integer check (rating >= 1 and rating <= 5),
  display_order integer default 0,
  is_featured boolean default false,
  created_at timestamptz default now()
);

alter table public.testimonials enable row level security;
do $$ begin
  create policy "testimonials read" on public.testimonials
    for select using (true);
exception when others then null; end $$;

create index if not exists testimonials_display_order_idx
  on public.testimonials (display_order desc, created_at desc);

-- FAQs for frequently asked questions
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order integer default 0,
  is_published boolean default true,
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.faqs enable row level security;
do $$ begin
  create policy "faqs read" on public.faqs
    for select using (is_published = true);
exception when others then null; end $$;

create index if not exists faqs_display_order_idx
  on public.faqs (display_order asc, created_at asc);

-- Service detail pages for individual service information
create table if not exists public.service_details (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- e.g., 'balayage', 'fashion-color'
  service_name text not null,
  category text not null,
  base_price numeric,
  hero_image text, -- storage object name
  description text,
  process_steps jsonb default '[]'::jsonb, -- [{step: 1, title: 'Consultation', desc: '...'}]
  pricing_tiers jsonb default '[]'::jsonb, -- [{name: 'Short Hair', price: 150}, ...]
  duration_min integer,
  aftercare_tips text,
  faqs jsonb default '[]'::jsonb, -- [{q: '...', a: '...'}]
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.service_details enable row level security;
do $$ begin
  create policy "service_details read" on public.service_details
    for select using (is_published = true);
exception when others then null; end $$;

create index if not exists service_details_slug_idx
  on public.service_details (slug);

create index if not exists service_details_category_idx
  on public.service_details (category);