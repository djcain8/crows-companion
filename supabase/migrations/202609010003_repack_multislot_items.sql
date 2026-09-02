-- The printed inventory sheet is five slots wide. Repack the two reviewed
-- playtest inventories whose multi-slot items were imported into alternating
-- columns before that geometry was confirmed. Item records and wounds are unchanged.

update public.characters
set inventory = jsonb_set(inventory, '{backpack}', '[
  {"itemId":"david-gluepot","wound":false},
  {"itemId":"david-tent","wound":false},
  {"itemId":"david-tent","wound":false},
  {"itemId":"david-padlock","wound":false},
  {"itemId":"david-pot","wound":false},
  {"itemId":"david-mushrooms","wound":false},
  {"itemId":"david-string","wound":false},
  {"itemId":"david-crafting-supplies","wound":false},
  {"itemId":"david-crafting-supplies","wound":false},
  {"itemId":"david-torch-pack","wound":false}
]'::jsonb)
where id = '3781e398-751d-4612-91b8-3b39dbebf1fe'; -- David

update public.characters
set inventory = jsonb_set(inventory, '{backpack}', '[
  {"itemId":"jack-chalk","wound":false},
  {"itemId":"jack-wolf-corpse","wound":false},
  {"itemId":"jack-wolf-corpse","wound":false},
  {"itemId":"jack-wolf-corpse","wound":false},
  {"itemId":"jack-wolf-corpse","wound":false},
  {"itemId":"jack-shovel","wound":false},
  {"itemId":"jack-grappling-hook","wound":false},
  {"itemId":null,"wound":false},
  {"itemId":null,"wound":false},
  {"itemId":null,"wound":false}
]'::jsonb)
where id = 'fc968c99-fcbf-4abb-8afd-f8bf8ade277b'; -- Jack
