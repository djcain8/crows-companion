create table public.expeditions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.expedition_maps (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references public.expeditions(id) on delete cascade,
  room_number smallint not null check (room_number between 1 and 99),
  name text not null,
  image_path text not null,
  unique (expedition_id, room_number)
);

create table public.map_tokens (
  id uuid primary key default gen_random_uuid(),
  expedition_id uuid not null references public.expeditions(id) on delete cascade,
  map_id uuid not null references public.expedition_maps(id) on delete cascade,
  character_id uuid references public.characters(id) on delete cascade,
  kind text not null check (kind in ('player', 'enemy')),
  label text not null,
  color text not null,
  x double precision not null default 0.5 check (x between 0 and 1),
  y double precision not null default 0.5 check (y between 0 and 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (expedition_id, character_id)
);

alter table public.expeditions enable row level security;
alter table public.expedition_maps enable row level security;
alter table public.map_tokens enable row level security;

create policy "anonymous expedition access" on public.expeditions for all to anon using (true) with check (true);
create policy "anonymous expedition map access" on public.expedition_maps for all to anon using (true) with check (true);
create policy "anonymous map token access" on public.map_tokens for all to anon using (true) with check (true);

alter publication supabase_realtime add table public.map_tokens;

insert into public.expeditions (id, campaign_id, name)
values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'First Expedition');

insert into public.expedition_maps (id, expedition_id, room_number, name, image_path) values
  ('00000000-0000-4000-8000-000000000111', '00000000-0000-4000-8000-000000000101', 1, 'Room 1', '/maps/room-1.png'),
  ('00000000-0000-4000-8000-000000000112', '00000000-0000-4000-8000-000000000101', 2, 'Room 2', '/maps/room-2.png'),
  ('00000000-0000-4000-8000-000000000113', '00000000-0000-4000-8000-000000000101', 3, 'Room 3', '/maps/room-3.png'),
  ('00000000-0000-4000-8000-000000000114', '00000000-0000-4000-8000-000000000101', 4, 'Room 4', '/maps/room-4.png'),
  ('00000000-0000-4000-8000-000000000115', '00000000-0000-4000-8000-000000000101', 5, 'Room 5', '/maps/room-5.png');
