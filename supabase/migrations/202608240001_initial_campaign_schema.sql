create extension if not exists pgcrypto;

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  village_name text not null,
  prosperity smallint not null default 0 check (prosperity between -10 and 10),
  current_day integer not null default 1 check (current_day > 0),
  current_cycle integer not null default 1 check (current_cycle > 0),
  treasury_gc integer not null default 0 check (treasury_gc >= 0),
  current_event text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  kind text not null,
  name text not null,
  steward_name text,
  level smallint not null default 1 check (level between 1 and 6),
  status text not null default 'operating',
  pending_level smallint check (pending_level between 1 and 6),
  created_at timestamptz not null default now(),
  unique (campaign_id, kind)
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  name text not null,
  player_name text,
  portrait_url text,
  wounds smallint not null default 0 check (wounds >= 0),
  txp integer not null default 0 check (txp >= 0),
  summary text,
  is_active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  name text not null,
  quantity integer not null default 1 check (quantity >= 0),
  value_gc integer check (value_gc >= 0),
  location text not null default 'shared',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;
alter table public.institutions enable row level security;
alter table public.characters enable row level security;
alter table public.inventory_items enable row level security;

-- MVP ONLY: everyone holding the public app URL can read and edit campaign data.
-- Replace these policies with campaign membership checks before adding authentication.
create policy "anonymous campaign access" on public.campaigns for all to anon using (true) with check (true);
create policy "anonymous institution access" on public.institutions for all to anon using (true) with check (true);
create policy "anonymous character access" on public.characters for all to anon using (true) with check (true);
create policy "anonymous inventory access" on public.inventory_items for all to anon using (true) with check (true);

