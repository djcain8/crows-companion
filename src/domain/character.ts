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
export type InventoryEntry = { name: string; kind: "item" | "wound" };
export type InventorySlot = InventoryEntry | null;
export type CharacterInventory = {
  hands: InventorySlot[];
  belt: InventorySlot[];
  backpack: InventorySlot[];
};

export const inventorySlotCounts = { hands: 2, belt: 4, backpack: 10 } as const;

export function emptyInventory(): CharacterInventory {
  return {
    hands: Array(inventorySlotCounts.hands).fill(null),
    belt: Array(inventorySlotCounts.belt).fill(null),
    backpack: Array(inventorySlotCounts.backpack).fill(null),
  };
}

function normalizedSlots(value: unknown, count: number, allowWounds: boolean): InventorySlot[] {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length: count }, (_, index) => {
    const entry = source[index];
    if (!entry || typeof entry !== "object") return null;
    const name = "name" in entry && typeof entry.name === "string" ? entry.name.trim() : "";
    if (!name) return null;
    const kind = allowWounds && "kind" in entry && entry.kind === "wound" ? "wound" : "item";
    return { name, kind };
  });
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
