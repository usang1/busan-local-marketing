create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  lead_type text not null
    check (lead_type in ('free_audit', 'consultation')),

  business_name text not null,
  contact_name text not null,
  phone text not null,
  industry text not null,
  region text not null,

  place_url text,
  budget text,
  current_marketing text,
  concerns text,
  interested_services text,
  competitor text,
  preferred_contact_time text,
  message text,

  status text not null default 'new'
    check (
      status in (
        'new',
        'contacted',
        'consulting',
        'proposal',
        'contracted',
        'on_hold',
        'rejected'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

create index if not exists leads_type_created_at_idx
  on public.leads (lead_type, created_at desc);

create index if not exists leads_phone_created_at_idx
  on public.leads (phone, created_at desc);

