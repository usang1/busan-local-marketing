alter table public.leads
  add column if not exists admin_memo text;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'manager', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text not null,
  industry text not null,
  location text not null,
  summary text not null,
  challenge text not null,
  strategy jsonb not null default '[]'::jsonb,
  execution jsonb not null default '[]'::jsonb,
  result text not null,
  thumbnail_url text,
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price integer,
  price_label text not null default '상담 후 안내',
  features jsonb not null default '[]'::jsonb,
  recommended boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  purchase_type text not null default 'consultation_required' check (purchase_type in ('direct', 'consultation_required')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  brand_name text,
  tagline text,
  phone text,
  email text,
  kakao_chat_url text,
  service_region text,
  updated_at timestamptz not null default now()
);

create index if not exists portfolios_public_idx
  on public.portfolios (published, featured, sort_order, created_at desc);

create index if not exists products_public_idx
  on public.products (published, recommended, sort_order, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.leads enable row level security;
alter table public.admin_users enable row level security;
alter table public.portfolios enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (lead_type in ('consultation', 'free_audit'));

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
  on public.admin_users for select
  to authenticated
  using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Public can read published portfolios" on public.portfolios;
create policy "Public can read published portfolios"
  on public.portfolios for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can manage portfolios" on public.portfolios;
create policy "Admins can manage portfolios"
  on public.portfolios for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
  on public.products for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (id = 'default');

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_settings (id)
values ('default')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read portfolio images" on storage.objects;
create policy "Public can read portfolio images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "Admins can upload portfolio images" on storage.objects;
create policy "Admins can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "Admins can update portfolio images" on storage.objects;
create policy "Admins can update portfolio images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin())
  with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "Admins can delete portfolio images" on storage.objects;
create policy "Admins can delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-images' and public.is_admin());
