create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  business_name text not null,
  industry text not null,
  region text not null,
  place_url text,
  input_data jsonb not null default '{}'::jsonb,
  result_data jsonb not null default '{}'::jsonb,
  status text not null default 'completed' check (status in ('completed', 'consultation_requested', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audits_created_at_idx on public.audits(created_at desc);
create index if not exists audits_lead_id_idx on public.audits(lead_id);
create index if not exists audits_status_created_at_idx on public.audits(status, created_at desc);

alter table public.audits enable row level security;

drop policy if exists "Admins can read audits" on public.audits;
create policy "Admins can read audits"
  on public.audits for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update audits" on public.audits;
create policy "Admins can update audits"
  on public.audits for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
