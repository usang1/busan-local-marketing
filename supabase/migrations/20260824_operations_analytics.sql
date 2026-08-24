alter table public.leads
  add column if not exists is_test boolean not null default false,
  add column if not exists contacted_at timestamptz,
  add column if not exists consulted_at timestamptz,
  add column if not exists proposed_at timestamptz,
  add column if not exists contracted_at timestamptz;

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_created_at_idx on public.leads(status, created_at desc);
create index if not exists leads_type_created_at_idx on public.leads(lead_type, created_at desc);
create index if not exists leads_is_test_created_at_idx on public.leads(is_test, created_at desc);
create index if not exists leads_attribution_created_at_idx
  on public.leads(utm_source, utm_medium, utm_campaign, created_at desc);

create index if not exists orders_lead_id_idx on public.orders(lead_id);
create index if not exists orders_status_created_at_idx on public.orders(status, created_at desc);
create index if not exists orders_attribution_created_at_idx
  on public.orders(utm_source, utm_medium, utm_campaign, created_at desc);
