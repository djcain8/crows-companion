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
export type InventorySlot = { item: string | null; wound: string | null };
export type CharacterInventory = {
  hands: InventorySlot[];
  belt: InventorySlot[];
  backpack: InventorySlot[];
};

export const inventorySlotCounts = { hands: 2, belt: 4, backpack: 10 } as const;

export function emptyInventory(): CharacterInventory {
  return {
    hands: Array.from({ length: inventorySlotCounts.hands }, () => ({ item: null, wound: null })),
    belt: Array.from({ length: inventorySlotCounts.belt }, () => ({ item: null, wound: null })),
    backpack: Array.from({ length: inventorySlotCounts.backpack }, () => ({ item: null, wound: null })),
  };
}

function normalizedSlots(value: unknown, count: number, allowWounds: boolean): InventorySlot[] {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const entry = source[index];
    if (!entry || typeof entry !== "object") return { item: null, wound: null };
    const clean = (candidate: unknown) => typeof candidate === "string" && candidate.trim() ? candidate.trim() : null;

    // Read the first inventory format as well as the current dual-occupancy format.
    if ("name" in entry) {
      const name = clean(entry.name);
      const isWound = allowWounds && "kind" in entry && entry.kind === "wound";
      return { item: isWound ? null : name, wound: isWound ? name : null };
    }

    return {
      item: "item" in entry ? clean(entry.item) : null,
      wound: allowWounds && "wound" in entry ? clean(entry.wound) : null,
    };
  });
}

export function inventorySpeedPenalty(inventory: CharacterInventory): number {
  return inventory.backpack.filter((slot) => slot.item && slot.wound).length;
}

export function normalizeInventory(value: unknown): CharacterInventory {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    hands: normalizedSlots(source.hands, inventorySlotCounts.hands, false),
    belt: normalizedSlots(source.belt, inventorySlotCounts.belt, false),
    backpack: normalizedSlots(source.backpack, inventorySlotCounts.backpack, true),
  };
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
