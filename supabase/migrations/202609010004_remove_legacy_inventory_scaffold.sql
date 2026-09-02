-- Character inventory now lives exclusively in characters.inventory as
-- structured JSON. The original relational scaffold was audited as empty.
drop table public.inventory_items;

comment on column public.characters.inventory is
  'Structured item instances referenced by fixed carried slots, with town chest and unassigned storage.';
