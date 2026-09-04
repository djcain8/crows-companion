create table public.travel_assignments (
  id uuid primary key default gen_random_uuid(),
  travel_day_id uuid not null references public.travel_days(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  role text not null check (role in ('supporter', 'guide', 'scout', 'tracker', 'sit_out')),
  task text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (travel_day_id, character_id),
  check (
    role in ('supporter', 'guide', 'scout', 'tracker')
    or (role = 'sit_out' and task is null)
  )
);

alter table public.travel_assignments enable row level security;

create policy "anonymous travel assignment access"
  on public.travel_assignments for all to anon using (true) with check (true);

alter publication supabase_realtime add table public.travel_assignments;
