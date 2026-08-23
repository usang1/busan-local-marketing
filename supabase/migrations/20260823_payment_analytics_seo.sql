alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_page text,
  add column if not exists referrer text;

alter table public.site_settings
  add column if not exists business_name text,
  add column if not exists address text;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  lead_id uuid references public.leads(id) on delete set null,
  product_id uuid not null references public.products(id) on delete restrict,
  business_name text not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  request_note text,
  amount integer not null check (amount >= 0),
  currency text not null default 'KRW',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  payment_provider text not null default 'mock',
  payment_key text,
  failure_code text,
  failure_message text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_status_created_at_idx
  on public.orders (status, created_at desc);

create index if not exists orders_product_created_at_idx
  on public.orders (product_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can insert orders" on public.orders;
create policy "Admins can insert orders"
  on public.orders for insert
  to authenticated
  with check (public.is_admin());
