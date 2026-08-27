alter table public.characters
  add column inventory jsonb not null default jsonb_build_object(
    'hands', jsonb_build_array(null, null),
    'belt', jsonb_build_array(null, null, null, null),
    'backpack', jsonb_build_array(null, null, null, null, null, null, null, null, null, null)
  );

comment on column public.characters.inventory is
  'Fixed character inventory: 2 hand slots, 4 belt slots, and 10 backpack slots. Backpack entries may be items or wounds.';
