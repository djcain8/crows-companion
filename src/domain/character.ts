export const characterStatuses = ["active", "dead", "retired", "archived"] as const;
export type CharacterStatus = (typeof characterStatuses)[number];

export const backgrounds = [
  "Acolyte of the Gardner", "Acolyte of the Healer", "Acolyte of the Smith",
  "Acolyte of the Three", "Acolyte of the Warrior", "Alchemist", "Apprentice Mage",
  "Archer", "Assassin", "Beggar", "Blacksmith", "Bodyguard", "Cartographer",
  "Conjurer", "Cook", "Duelist", "Entertainer", "Executioner", "Farmer", "Gladiator",
  "Hunter", "Hydromancer", "Illusionist", "Keraunomancer", "Knight", "Merchant",
  "Miner", "Noble", "Pugilist", "Pyromancer", "Sage", "Soldier", "Thief", "Tinkerer",
  "Transmuter", "Village Watch",
] as const;

export const expertiseNames = [
  "Alchemy", "Alteration", "Athletics", "Bashing", "Benefaction", "Blacksmithing",
  "Bow", "Chopping", "Conjuration", "Elemental", "Enchanting", "Endurance", "Gymnastics",
  "Handle Pet", "Historical Lore", "Illusion", "Lift", "Magic Lore", "Monster Lore",
  "Nature Lore", "Navigate", "Necromancy", "Pick Lock", "Religious Lore", "Search",
  "Slashing", "Stabbing", "Stealth", "Thievery", "Unarmed",
] as const;

export function isBackground(value: string): value is (typeof backgrounds)[number] {
  return backgrounds.includes(value as (typeof backgrounds)[number]);
}

export type ExpertiseEntry = { name: string; uses: number };
export type TraitEntry = { name: string; tree: string | null };
export type InventoryItem = {
  id: string;
  catalogId: string | null;
  name: string;
  quantity: number;
  slots: number;
  stackLimit: number;
  description: string | null;
  valueGc: number | null;
  contentsGc: number | null;
  notes: string | null;
};
export type InventorySlot = { itemId: string | null; wound: boolean };
export type CharacterInventory = {
  version: 2;
  items: InventoryItem[];
  hands: InventorySlot[];
  belt: InventorySlot[];
  backpack: InventorySlot[];
  storage: { townChest: string[]; unassigned: string[] };
};

export const inventorySlotCounts = { hands: 2, belt: 4, backpack: 10 } as const;
export type InventoryGroup = keyof typeof inventorySlotCounts;

export function emptyInventory(): CharacterInventory {
  return {
    version: 2,
    items: [],
    hands: Array.from({ length: inventorySlotCounts.hands }, () => ({ itemId: null, wound: false })),
    belt: Array.from({ length: inventorySlotCounts.belt }, () => ({ itemId: null, wound: false })),
    backpack: Array.from({ length: inventorySlotCounts.backpack }, () => ({ itemId: null, wound: false })),
    storage: { townChest: [], unassigned: [] },
  };
}

function cleanText(candidate: unknown): string | null {
  return typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;
}

function positiveInteger(candidate: unknown, fallback: number): number {
  return typeof candidate === "number" && Number.isInteger(candidate) && candidate > 0 ? candidate : fallback;
}

function nonNegativeInteger(candidate: unknown): number | null {
  return typeof candidate === "number" && Number.isInteger(candidate) && candidate >= 0 ? candidate : null;
}

function normalizedItem(value: unknown): InventoryItem | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const id = cleanText(source.id);
  const name = cleanText(source.name);
  if (!id || !name) return null;
  return {
    id,
    catalogId: cleanText(source.catalogId),
    name,
    quantity: positiveInteger(source.quantity, 1),
    slots: positiveInteger(source.slots, 1),
    stackLimit: positiveInteger(source.stackLimit, 1),
    description: cleanText(source.description),
    valueGc: nonNegativeInteger(source.valueGc),
    contentsGc: nonNegativeInteger(source.contentsGc),
    notes: cleanText(source.notes),
  };
}

function normalizedStructuredSlots(value: unknown, count: number, allowWounds: boolean, validItemIds: Set<string>): InventorySlot[] {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const entry = source[index];
    if (!entry || typeof entry !== "object") return { itemId: null, wound: false };
    const itemId = "itemId" in entry ? cleanText(entry.itemId) : null;
    return {
      itemId: itemId && validItemIds.has(itemId) ? itemId : null,
      wound: Boolean(allowWounds && "wound" in entry && entry.wound === true),
    };
  });
}

function normalizedStorageIds(value: unknown, validItemIds: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(cleanText).filter((id): id is string => Boolean(id && validItemIds.has(id))))];
}

function normalizeStructuredInventory(source: Record<string, unknown>): CharacterInventory {
  const items = Array.isArray(source.items) ? source.items.map(normalizedItem).filter((item): item is InventoryItem => Boolean(item)) : [];
  const uniqueItems = [...new Map(items.map((item) => [item.id, item])).values()];
  const validItemIds = new Set(uniqueItems.map((item) => item.id));
  const storage = source.storage && typeof source.storage === "object" ? source.storage as Record<string, unknown> : {};
  const hands = normalizedStructuredSlots(source.hands, inventorySlotCounts.hands, false, validItemIds);
  const belt = normalizedStructuredSlots(source.belt, inventorySlotCounts.belt, false, validItemIds);
  const backpack = normalizedStructuredSlots(source.backpack, inventorySlotCounts.backpack, true, validItemIds);
  const carriedItemIds = new Set([...hands, ...belt, ...backpack].map((slot) => slot.itemId).filter((id): id is string => Boolean(id)));
  const townChest = normalizedStorageIds(storage.townChest, validItemIds).filter((id) => !carriedItemIds.has(id));
  const townChestIds = new Set(townChest);
  return {
    version: 2,
    items: uniqueItems,
    hands,
    belt,
    backpack,
    storage: {
      townChest,
      unassigned: normalizedStorageIds(storage.unassigned, validItemIds).filter((id) => !carriedItemIds.has(id) && !townChestIds.has(id)),
    },
  };
}

export function inventoryItem(inventory: CharacterInventory, itemId: string | null): InventoryItem | null {
  return itemId ? inventory.items.find((item) => item.id === itemId) ?? null : null;
}

export function inventorySpeedPenalty(inventory: CharacterInventory): number {
  return inventory.backpack.filter((slot) => slot.itemId && slot.wound).length;
}

export function normalizeInventory(value: unknown): CharacterInventory {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return normalizeStructuredInventory(source);
}

export type CharacterRecord = {
  id: string;
  campaignId: string;
  name: string;
  playerName: string | null;
  distinguishingFeature: string | null;
  background: string | null;
  status: CharacterStatus;
  agility: number;
  mind: number;
  strength: number;
  staminaCurrent: number;
  staminaMax: number;
  baseSpeed: number;
  txp: number;
  spentXp: number;
  goldGc: number;
  summary: string | null;
  connectionName: string | null;
  connectionRelationship: string | null;
  connectionBenefit: string | null;
  expertises: ExpertiseEntry[];
  traits: TraitEntry[];
  inventory: CharacterInventory;
};

export function parseNamedLines(value: string): string[] {
  return [...new Set(value.split(/\r?\n|,/).map((entry) => entry.trim()).filter(Boolean))];
}

export function parseExpertises(value: string): ExpertiseEntry[] {
  return parseNamedLines(value).map((entry) => {
    const match = entry.match(/^(.*?)(?:\s*[:(]\s*(-?\d+)\s*\)?)?$/);
    const name = match?.[1]?.trim() || entry;
    const uses = Number(match?.[2] ?? 1);
    return { name, uses: Math.max(0, uses) };
  });
}

export function parseTraits(value: string): TraitEntry[] {
  return parseNamedLines(value).map((entry) => {
    const separator = entry.indexOf(":");
    if (separator === -1) return { name: entry, tree: null };
    return {
      tree: entry.slice(0, separator).trim() || null,
      name: entry.slice(separator + 1).trim() || entry,
    };
  });
}

export function integerFromForm(value: FormDataEntryValue | null, fallback: number): number {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
