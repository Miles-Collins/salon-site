-- Enable Row Level Security on all public tables
-- This should be run in your Supabase SQL Editor

-- Enable RLS on reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on metrics_daily table
ALTER TABLE public.metrics_daily ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated owner access
-- Adjust these policies based on your needs

-- Reports: Owner can do everything
CREATE POLICY "Owner full access to reports"
  ON public.reports
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Appointments: Owner can do everything
CREATE POLICY "Owner full access to appointments"
  ON public.appointments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Clients: Owner can do everything
CREATE POLICY "Owner full access to clients"
  ON public.clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Payments: Owner can do everything
CREATE POLICY "Owner full access to payments"
  ON public.payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Metrics Daily: Owner can do everything
CREATE POLICY "Owner full access to metrics_daily"
  ON public.metrics_daily
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Note: The policies above allow full access when using the service role key.
-- If you want more granular control (e.g., based on user email), you would need
-- to modify these policies to check against your OWNER_ALLOWED_EMAILS.
-- 
-- For now, since you're using the service role key in your API routes,
-- these policies will work. The security is enforced by your application code
-- checking the allowlist in OwnerGate.
