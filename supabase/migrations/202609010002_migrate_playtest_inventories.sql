-- Reviewed with the campaign owner on 2026-09-01. This migration intentionally
-- names each playtest character so custom items and multi-slot placements remain explicit.

update public.characters set inventory = '{
  "version":2,
  "items":[],
  "hands":[{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "belt":[{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "backpack":[{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":true},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "storage":{"townChest":[],"unassigned":[]}
}'::jsonb where id = 'befe6c2e-a4d3-442c-8c22-23f9eb37e815'; -- jimothy

update public.characters set inventory = '{
  "version":2,
  "items":[
    {"id":"david-torch-hand","catalogId":"torch","name":"Torch","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-knife","catalogId":"knife","name":"Knife","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-coin-purse","catalogId":"coin-purse","name":"Coin Purse","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":0,"notes":null},
    {"id":"david-gluepot","catalogId":"gluepot","name":"Gluepot","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-tent","catalogId":"tent","name":"Tent","quantity":1,"slots":2,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-padlock","catalogId":"padlock","name":"Padlock","quantity":1,"slots":1,"stackLimit":3,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-pot","catalogId":"pot","name":"Pot","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-mushrooms","catalogId":null,"name":"Handful of Mushrooms","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-string","catalogId":"string","name":"String","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"david-crafting-supplies","catalogId":null,"name":"Crafting Supplies","quantity":10,"slots":1,"stackLimit":5,"description":null,"valueGc":null,"contentsGc":null,"notes":"Two full stacks"},
    {"id":"david-torch-pack","catalogId":"torch","name":"Torch","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null}
  ],
  "hands":[{"itemId":"david-torch-hand","wound":false},{"itemId":"david-knife","wound":false}],
  "belt":[{"itemId":"david-coin-purse","wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "backpack":[{"itemId":"david-gluepot","wound":false},{"itemId":"david-tent","wound":false},{"itemId":"david-padlock","wound":false},{"itemId":"david-tent","wound":false},{"itemId":"david-pot","wound":false},{"itemId":"david-mushrooms","wound":false},{"itemId":"david-string","wound":false},{"itemId":"david-crafting-supplies","wound":false},{"itemId":"david-torch-pack","wound":false},{"itemId":"david-crafting-supplies","wound":false}],
  "storage":{"townChest":[],"unassigned":[]}
}'::jsonb where id = '3781e398-751d-4612-91b8-3b39dbebf1fe'; -- David

update public.characters set inventory = '{
  "version":2,
  "items":[
    {"id":"jack-lantern","catalogId":"lantern","name":"Lantern","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-oil-flask","catalogId":"oil-flask","name":"Oil Flask","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-warpick","catalogId":"warpick","name":"Warpick","quantity":1,"slots":2,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-coin-purse","catalogId":"coin-purse","name":"Coin Purse","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":15,"notes":null},
    {"id":"jack-chalk","catalogId":"chalk","name":"Chalk","quantity":1,"slots":1,"stackLimit":5,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-wolf-corpse","catalogId":null,"name":"Wolf Corpse","quantity":1,"slots":4,"stackLimit":1,"description":"A Medium wolf corpse.","valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-shovel","catalogId":"shovel","name":"Shovel","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"jack-grappling-hook","catalogId":"grappling-hook","name":"Grappling Hook","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":null,"notes":null}
  ],
  "hands":[{"itemId":null,"wound":false},{"itemId":"jack-lantern","wound":false}],
  "belt":[{"itemId":"jack-oil-flask","wound":false},{"itemId":"jack-warpick","wound":false},{"itemId":"jack-warpick","wound":false},{"itemId":"jack-coin-purse","wound":false}],
  "backpack":[{"itemId":"jack-chalk","wound":false},{"itemId":"jack-wolf-corpse","wound":false},{"itemId":"jack-shovel","wound":false},{"itemId":"jack-wolf-corpse","wound":false},{"itemId":"jack-grappling-hook","wound":false},{"itemId":"jack-wolf-corpse","wound":false},{"itemId":null,"wound":false},{"itemId":"jack-wolf-corpse","wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "storage":{"townChest":[],"unassigned":[]}
}'::jsonb where id = 'fc968c99-fcbf-4abb-8afd-f8bf8ade277b'; -- Jack

update public.characters set inventory = '{
  "version":2,
  "items":[
    {"id":"aata-knife","catalogId":"knife","name":"Knife","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-coin-purse","catalogId":"coin-purse","name":"Coin Purse","quantity":1,"slots":1,"stackLimit":1,"description":null,"valueGc":null,"contentsGc":65,"notes":null},
    {"id":"aata-rations","catalogId":"ration","name":"Ration","quantity":6,"slots":1,"stackLimit":6,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-lantern","catalogId":"lantern","name":"Lantern","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-oil-flask","catalogId":"oil-flask","name":"Oil Flask","quantity":1,"slots":1,"stackLimit":2,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-animal-feed","catalogId":"animal-feed","name":"Animal Feed","quantity":6,"slots":1,"stackLimit":6,"description":null,"valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-lore-book","catalogId":"lore-book","name":"Lore Book","quantity":1,"slots":1,"stackLimit":1,"description":"Historical Lore","valueGc":null,"contentsGc":null,"notes":null},
    {"id":"aata-riding-horse","catalogId":null,"name":"Riding Horse","quantity":1,"slots":1,"stackLimit":1,"description":"Pet; does not occupy a character inventory slot.","valueGc":null,"contentsGc":null,"notes":"Placeholder until pets have their own records and backpacks."}
  ],
  "hands":[{"itemId":"aata-knife","wound":false},{"itemId":null,"wound":false}],
  "belt":[{"itemId":"aata-coin-purse","wound":false},{"itemId":"aata-rations","wound":false},{"itemId":"aata-lantern","wound":false},{"itemId":"aata-oil-flask","wound":false}],
  "backpack":[{"itemId":"aata-animal-feed","wound":false},{"itemId":null,"wound":false},{"itemId":"aata-lore-book","wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false},{"itemId":null,"wound":false}],
  "storage":{"townChest":[],"unassigned":["aata-riding-horse"]}
}'::jsonb where id = '402133c4-c1ac-48c4-bcfd-d9ae2b0fab25'; -- Aata

