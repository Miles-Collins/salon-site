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


//test