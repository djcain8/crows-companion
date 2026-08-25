alter table public.campaigns add column preset text;
create unique index campaigns_preset_unique on public.campaigns (preset) where preset is not null;
alter table public.institutions add column details jsonb not null default '{}'::jsonb;
alter table public.characters add column gold_gc integer not null default 0 check (gold_gc >= 0);

insert into public.campaigns (id, name, village_name, prosperity, current_day, current_cycle, treasury_gc, preset)
values ('00000000-0000-4000-8000-000000000001', 'Gadwick Playtest', 'Gadwick', 0, 1, 1, 0, 'gadwick_playtest')
on conflict (id) do nothing;

insert into public.institutions (campaign_id, kind, name, steward_name, level, details)
values
  ('00000000-0000-4000-8000-000000000001', 'alchemist', 'Alchemist', 'Brune', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'auction_house', 'Auction House', 'Lili', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'barracks', 'Barracks', 'Cormal', 2, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'blacksmith', 'Blacksmith', 'Deirdre', 2, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'bookseller', 'Bookseller', 'Rion', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'enchanter', 'Enchanter', 'Isaac', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'general_store', 'General Store', 'Sorcha', 3, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'stables', 'Stables', 'Anna', 3, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'temple', 'Temple', 'Mackle', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'inn', 'Inn', 'Duna', 1, '{}'),
  ('00000000-0000-4000-8000-000000000001', 'crypt', 'Crypt', 'Oda', 1, '{"boons":[{"name":"Greed","uses":1},{"name":"Rescue","uses":1},{"name":"Vitality","uses":1}]}'::jsonb)
on conflict (campaign_id, kind) do update set
  name = excluded.name,
  steward_name = excluded.steward_name,
  level = excluded.level,
  details = excluded.details;
