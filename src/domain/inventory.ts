import { equipmentEntries } from "./equipment";
import { emptyInventory, inventorySlotCounts, type CharacterInventory, type InventoryItem, type InventorySlot } from "./character";

export type InventoryGroup = keyof typeof inventorySlotCounts;
export type InventorySlotDraft = { name: string | null; wound: boolean };
export type InventoryDraft = Record<InventoryGroup, InventorySlotDraft[]>;

const equipmentByName = new Map(equipmentEntries.map((item) => [item.name.toLocaleLowerCase(), item]));

function itemFromName(name: string, previous: InventoryItem | undefined, makeId: () => string): InventoryItem {
  const catalog = equipmentByName.get(name.toLocaleLowerCase());
  const unchanged = previous?.name.toLocaleLowerCase() === name.toLocaleLowerCase();
  return {
    id: unchanged && previous ? previous.id : makeId(),
    catalogId: catalog?.id ?? (unchanged ? previous?.catalogId ?? null : null),
    name: catalog?.name ?? name,
    quantity: unchanged ? previous?.quantity ?? 1 : 1,
    slots: catalog?.slots ?? (unchanged ? previous?.slots ?? 1 : 1),
    stackLimit: catalog?.stack ?? (unchanged ? previous?.stackLimit ?? 1 : 1),
    description: unchanged ? previous?.description ?? null : null,
    valueGc: unchanged ? previous?.valueGc ?? null : null,
    contentsGc: unchanged ? previous?.contentsGc ?? null : null,
    notes: unchanged ? previous?.notes ?? null : null,
  };
}

export function rebuildCarriedInventory(current: CharacterInventory, draft: InventoryDraft, makeId: () => string = () => crypto.randomUUID()): CharacterInventory {
  const currentItems = new Map(current.items.map((item) => [item.id, item]));
  const nextItems = new Map<string, InventoryItem>();
  const next = emptyInventory();
  next.storage = { townChest:[...current.storage.townChest], unassigned:[...current.storage.unassigned] };

  for (const group of ["hands", "belt", "backpack"] as const) {
    next[group] = Array.from({ length: inventorySlotCounts[group] }, (_, index): InventorySlot => {
      const entry = draft[group][index] ?? { name:null, wound:false };
      const wound = group === "backpack" && entry.wound;
      if (!entry.name) return { itemId:null, wound };
      const previousId = current[group][index]?.itemId;
      const item = itemFromName(entry.name, previousId ? currentItems.get(previousId) : undefined, makeId);
      nextItems.set(item.id, item);
      return { itemId:item.id, wound };
    });
  }

  for (const itemId of [...next.storage.townChest, ...next.storage.unassigned]) {
    const item = currentItems.get(itemId);
    if (item) nextItems.set(item.id, item);
  }
  next.items = [...nextItems.values()];
  return next;
}
