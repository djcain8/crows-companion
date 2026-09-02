import { equipmentById } from "./equipment";
import { inventoryItem, inventorySlotCounts, type CharacterInventory, type InventoryGroup, type InventoryItem, type InventorySlot } from "./character";

export const inventoryGroupColumns: Record<InventoryGroup, number> = { hands: 2, belt: 4, backpack: 5 };

export function requiredSlots(item: InventoryItem, group: InventoryGroup): number {
  const catalog = item.catalogId ? equipmentById.get(item.catalogId) : null;
  const stackCount = group === "hands" ? item.quantity : Math.ceil(item.quantity / item.stackLimit);
  const handSlots = group === "hands" && (catalog?.attack?.qualities.includes("Cumbersome") || catalog?.name === "Musical Instrument") ? 2 : item.slots;
  return handSlots * stackCount;
}

export function occupiedSlotIndexes(inventory: CharacterInventory, itemId: string, group: InventoryGroup): number[] {
  return inventory[group].flatMap((slot, index) => slot.itemId === itemId ? [index] : []);
}

export function canPlaceItem(inventory: CharacterInventory, itemId: string, group: InventoryGroup, startIndex: number): boolean {
  const item = inventoryItem(inventory, itemId);
  if (!item || startIndex < 0) return false;
  const count = requiredSlots(item, group);
  if (startIndex + count > inventorySlotCounts[group]) return false;
  const ownSlots = new Set(occupiedSlotIndexes(inventory, itemId, group));
  return inventory[group].slice(startIndex, startIndex + count).every((slot, offset) => !slot.itemId || ownSlots.has(startIndex + offset));
}

function cloneInventory(inventory: CharacterInventory): CharacterInventory {
  return {
    ...inventory,
    items:inventory.items.map((item) => ({ ...item })),
    hands:inventory.hands.map((slot) => ({ ...slot })),
    belt:inventory.belt.map((slot) => ({ ...slot })),
    backpack:inventory.backpack.map((slot) => ({ ...slot })),
    storage:{ townChest:[...inventory.storage.townChest], unassigned:[...inventory.storage.unassigned] },
  };
}

export function removeItemPlacement(inventory: CharacterInventory, itemId: string): CharacterInventory {
  const next = cloneInventory(inventory);
  for (const group of ["hands", "belt", "backpack"] as const) {
    next[group] = next[group].map((slot): InventorySlot => slot.itemId === itemId ? { ...slot, itemId:null } : slot);
  }
  next.storage.townChest = next.storage.townChest.filter((id) => id !== itemId);
  next.storage.unassigned = next.storage.unassigned.filter((id) => id !== itemId);
  return next;
}

export function placeItem(inventory: CharacterInventory, itemId: string, group: InventoryGroup, startIndex: number): CharacterInventory | null {
  if (!canPlaceItem(inventory, itemId, group, startIndex)) return null;
  const next = removeItemPlacement(inventory, itemId);
  const item = inventoryItem(next, itemId);
  if (!item) return null;
  const count = requiredSlots(item, group);
  for (let index = startIndex; index < startIndex + count; index += 1) next[group][index].itemId = itemId;
  return next;
}

export function storeItem(inventory: CharacterInventory, itemId: string, storage: "townChest" | "unassigned"): CharacterInventory {
  const next = removeItemPlacement(inventory, itemId);
  next.storage[storage].push(itemId);
  return next;
}

export function deleteInventoryItem(inventory: CharacterInventory, itemId: string): CharacterInventory {
  const next = removeItemPlacement(inventory, itemId);
  next.items = next.items.filter((item) => item.id !== itemId);
  return next;
}

type ItemLocation = { kind: "carried"; group: InventoryGroup; startIndex: number } | { kind: "storage"; storage: "townChest" | "unassigned" };

function itemLocation(inventory: CharacterInventory, itemId: string): ItemLocation | null {
  for (const group of ["hands", "belt", "backpack"] as const) {
    const startIndex = inventory[group].findIndex((slot) => slot.itemId === itemId);
    if (startIndex >= 0) return { kind: "carried", group, startIndex };
  }
  if (inventory.storage.townChest.includes(itemId)) return { kind: "storage", storage: "townChest" };
  if (inventory.storage.unassigned.includes(itemId)) return { kind: "storage", storage: "unassigned" };
  return null;
}

function moveToLocation(inventory: CharacterInventory, itemId: string, location: ItemLocation): CharacterInventory | null {
  return location.kind === "storage" ? storeItem(inventory, itemId, location.storage) : placeItem(inventory, itemId, location.group, location.startIndex);
}

export function swapItems(inventory: CharacterInventory, firstId: string, secondId: string): CharacterInventory | null {
  if (firstId === secondId) return inventory;
  const firstLocation = itemLocation(inventory, firstId);
  const secondLocation = itemLocation(inventory, secondId);
  if (!firstLocation || !secondLocation) return null;
  const cleared = removeItemPlacement(removeItemPlacement(inventory, firstId), secondId);
  const firstMoved = moveToLocation(cleared, firstId, secondLocation);
  return firstMoved ? moveToLocation(firstMoved, secondId, firstLocation) : null;
}

export function splitItem(inventory: CharacterInventory, itemId: string, quantity: number, newId: string): CharacterInventory | null {
  const item = inventoryItem(inventory, itemId);
  const location = itemLocation(inventory, itemId);
  if (!item || !location || quantity < 1 || quantity >= item.quantity || inventoryItem(inventory, newId)) return null;
  const cleared = removeItemPlacement(inventory, itemId);
  cleared.items = cleared.items.map((entry) => entry.id === itemId ? { ...entry, quantity: entry.quantity - quantity } : entry);
  cleared.items.push({ ...item, id: newId, quantity });
  const replaced = moveToLocation(cleared, itemId, location);
  return replaced ? storeItem(replaced, newId, "unassigned") : null;
}

export function canMergeItems(first: InventoryItem, second: InventoryItem): boolean {
  if (first.id === second.id || first.contentsGc !== null || second.contentsGc !== null) return false;
  if (first.catalogId || second.catalogId) return Boolean(first.catalogId && first.catalogId === second.catalogId);
  return first.name.toLocaleLowerCase() === second.name.toLocaleLowerCase()
    && first.slots === second.slots
    && first.stackLimit === second.stackLimit
    && first.description === second.description
    && first.valueGc === second.valueGc
    && first.notes === second.notes;
}

export function mergeItems(inventory: CharacterInventory, sourceId: string, targetId: string): CharacterInventory | null {
  const source = inventoryItem(inventory, sourceId);
  const target = inventoryItem(inventory, targetId);
  const targetLocation = itemLocation(inventory, targetId);
  if (!source || !target || !targetLocation || !canMergeItems(source, target)) return null;
  const cleared = removeItemPlacement(removeItemPlacement(inventory, sourceId), targetId);
  cleared.items = cleared.items
    .filter((item) => item.id !== sourceId)
    .map((item) => item.id === targetId ? { ...item, quantity: item.quantity + source.quantity } : item);
  return moveToLocation(cleared, targetId, targetLocation);
}

export function inventoryPlacementErrors(inventory: CharacterInventory): string[] {
  const errors: string[] = [];
  for (const item of inventory.items) {
    const carried = (["hands", "belt", "backpack"] as const).flatMap((group) => {
      const indexes = occupiedSlotIndexes(inventory, item.id, group);
      return indexes.length ? [{ group, indexes }] : [];
    });
    const stored = Number(inventory.storage.townChest.includes(item.id)) + Number(inventory.storage.unassigned.includes(item.id));
    if (carried.length + stored !== 1) {
      errors.push(`${item.name} must have exactly one location.`);
      continue;
    }
    if (!carried.length) continue;
    const { group, indexes } = carried[0];
    const expected = requiredSlots(item, group);
    const consecutive = indexes.every((index, offset) => index === indexes[0] + offset);
    if (indexes.length !== expected || !consecutive) errors.push(`${item.name} needs ${expected} adjacent ${group} slot${expected === 1 ? "" : "s"}.`);
  }
  for (const group of ["hands", "belt", "backpack"] as const) {
    for (const itemId of new Set(inventory[group].map((slot) => slot.itemId).filter(Boolean))) {
      if (!inventoryItem(inventory, itemId)) errors.push(`An unknown item occupies a ${group} slot.`);
    }
  }
  return errors;
}
