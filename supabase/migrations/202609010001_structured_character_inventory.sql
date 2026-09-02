alter table public.characters
  alter column inventory set default jsonb_build_object(
    'version', 2,
    'items', jsonb_build_array(),
    'hands', jsonb_build_array(
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false)
    ),
    'belt', jsonb_build_array(
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false)
    ),
    'backpack', jsonb_build_array(
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false),
      jsonb_build_object('itemId', null, 'wound', false)
    ),
    'storage', jsonb_build_object('townChest', jsonb_build_array(), 'unassigned', jsonb_build_array())
  );

comment on column public.characters.inventory is
  'Versioned item instances referenced by fixed carried slots, with town chest and unassigned storage. Legacy slot text is normalized by the application.';
