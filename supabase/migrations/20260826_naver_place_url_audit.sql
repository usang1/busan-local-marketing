alter table public.audits
  add column if not exists place_id text,
  add column if not exists place_name text,
  add column if not exists raw_place_data jsonb,
  add column if not exists analysis_result jsonb,
  add column if not exists score numeric,
  add column if not exists fetched_at timestamptz;

create index if not exists audits_place_id_created_at_idx
  on public.audits(place_id, created_at desc);

create index if not exists audits_score_idx
  on public.audits(score);
