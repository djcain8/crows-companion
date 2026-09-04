create table public.travel_journeys (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  status text not null default 'active' check (status in ('active', 'completed')),
  origin_label text,
  destination_label text,
  marker_x double precision not null default 0.877 check (marker_x between 0 and 1),
  marker_y double precision not null default 0.706 check (marker_y between 0 and 1),
  marker_visible boolean not null default true,
  destination_x double precision check (destination_x between 0 and 1),
  destination_y double precision check (destination_y between 0 and 1),
  current_day_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_travel_journey_per_campaign
  on public.travel_journeys (campaign_id) where status = 'active';

create table public.travel_days (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.travel_journeys(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  phase text not null default 'plan' check (phase in ('plan', 'assign', 'resolve', 'travel', 'rest', 'complete')),
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'ended_early')),
  pace text check (pace in ('slow', 'normal', 'fast')),
  follows_road boolean not null default false,
  travel_encounter_status text not null default 'unchecked' check (travel_encounter_status in ('unchecked', 'none', 'occurred', 'skipped')),
  rest_encounter_status text not null default 'unchecked' check (rest_encounter_status in ('unchecked', 'none', 'occurred', 'skipped')),
  rest_outcome text not null default 'pending' check (rest_outcome in ('pending', 'completed', 'interrupted', 'custom', 'skipped')),
  end_reason text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, day_number)
);

alter table public.travel_journeys
  add constraint travel_journeys_current_day_fkey foreign key (current_day_id) references public.travel_days(id) on delete set null;

create table public.travel_party_members (
  journey_id uuid not null references public.travel_journeys(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (journey_id, character_id)
);

create table public.travel_adjustments (
  id uuid primary key default gen_random_uuid(),
  travel_day_id uuid not null references public.travel_days(id) on delete cascade,
  character_id uuid references public.characters(id) on delete cascade,
  scope text not null check (scope in ('movement', 'day_en', 'night_en', 'test', 'persistent_condition')),
  kind text not null check (kind in ('numeric', 'edge', 'bane', 'note')),
  amount integer,
  label text not null,
  note text,
  source text not null default 'ref_ruling' check (source in ('automatic', 'role_result', 'equipment', 'trait', 'ref_ruling')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.travel_events (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.travel_journeys(id) on delete cascade,
  travel_day_id uuid references public.travel_days(id) on delete cascade,
  kind text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.travel_journeys enable row level security;
alter table public.travel_days enable row level security;
alter table public.travel_party_members enable row level security;
alter table public.travel_adjustments enable row level security;
alter table public.travel_events enable row level security;

create policy "anonymous travel journey access" on public.travel_journeys for all to anon using (true) with check (true);
create policy "anonymous travel day access" on public.travel_days for all to anon using (true) with check (true);
create policy "anonymous travel party access" on public.travel_party_members for all to anon using (true) with check (true);
create policy "anonymous travel adjustment access" on public.travel_adjustments for all to anon using (true) with check (true);
create policy "anonymous travel event access" on public.travel_events for all to anon using (true) with check (true);

alter publication supabase_realtime add table public.travel_journeys;
alter publication supabase_realtime add table public.travel_days;
alter publication supabase_realtime add table public.travel_party_members;
alter publication supabase_realtime add table public.travel_adjustments;
alter publication supabase_realtime add table public.travel_events;

insert into public.travel_journeys (id, campaign_id, name, origin_label, marker_x, marker_y)
values ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000001', 'Beyond Gadwick', 'Gadwick', 0.877, 0.706);

insert into public.travel_days (id, journey_id, day_number)
values ('00000000-0000-4000-8000-000000000211', '00000000-0000-4000-8000-000000000201', 1);

update public.travel_journeys
set current_day_id = '00000000-0000-4000-8000-000000000211'
where id = '00000000-0000-4000-8000-000000000201';
