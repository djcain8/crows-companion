alter table public.characters
  add column distinguishing_feature text,
  add column background text,
  add column status text not null default 'active' check (status in ('active', 'dead', 'retired', 'archived')),
  add column agility smallint not null default 0 check (agility between -5 and 10),
  add column mind smallint not null default 0 check (mind between -5 and 10),
  add column strength smallint not null default 0 check (strength between -5 and 10),
  add column stamina_current integer not null default 0 check (stamina_current >= 0),
  add column stamina_max integer not null default 0 check (stamina_max >= 0),
  add column base_speed smallint not null default 5 check (base_speed >= 0),
  add column spent_xp integer not null default 0 check (spent_xp >= 0),
  add column connection_name text,
  add column connection_relationship text,
  add column connection_benefit text,
  add column expertises jsonb not null default '[]'::jsonb,
  add column traits jsonb not null default '[]'::jsonb;

update public.characters set status = case when is_active then 'active' else 'archived' end;

create index characters_campaign_status_sort_idx
  on public.characters (campaign_id, status, sort_order, created_at);
