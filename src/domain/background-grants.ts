import { backgroundEntries } from "./compendium";
import { equipmentEntries, type EquipmentEntry } from "./equipment";
import { emptyInventory, type CharacterInventory, type ExpertiseEntry, type InventoryItem, type TraitEntry } from "./character";

export type BackgroundItemGrant = {
  catalogId: string | null;
  name: string;
  quantity: number;
  slots: number;
  stackLimit: number;
  description: string | null;
  valueGc: number | null;
  notes: string | null;
};

export type BackgroundGrant = {
  name: string;
  description: string;
  characteristicOptions: ("Agility" | "Mind" | "Strength")[];
  stamina: number;
  trait: TraitEntry;
  expertises: ExpertiseEntry[];
  equipment: BackgroundItemGrant[];
  extraGoldGc: number;
};

const universalEquipment = [
  { name: "Coin Purse", quantity: 1 },
  { name: "Knife", quantity: 1 },
  { name: "Rope", quantity: 1 },
  { name: "Ration", quantity: 6 },
];

function normalizedName(value: string) {
  return value.toLocaleLowerCase().replaceAll("’", "'").replaceAll("&", "and").replace(/[^a-z0-9]+/g, " ").trim();
}

const catalogByName = new Map(equipmentEntries.map((item) => [normalizedName(item.name), item]));

function catalogGrant(item: EquipmentEntry, quantity: number, options: Partial<Pick<BackgroundItemGrant, "name" | "description" | "notes">> = {}): BackgroundItemGrant {
  return {
    catalogId: item.id,
    name: options.name ?? item.name,
    quantity,
    slots: item.slots,
    stackLimit: item.stack,
    description: options.description ?? item.summary ?? item.rules ?? null,
    valueGc: item.priceGc,
    notes: options.notes ?? null,
  };
}

function catalogItem(name: string): EquipmentEntry {
  const item = catalogByName.get(normalizedName(name));
  if (!item) throw new Error(`Background equipment is missing from the catalog: ${name}`);
  return item;
}

function expertiseEntries(value: string): ExpertiseEntry[] {
  return value.split(",").map((part) => {
    const match = part.trim().match(/^(.*?)\s*\((\d+) uses\)$/i);
    const rawName = (match?.[1] ?? part).trim();
    return { name: rawName === "Blacksmith" ? "Blacksmithing" : rawName, uses: Number(match?.[2] ?? 1) };
  });
}

function traitEntry(value: string): TraitEntry {
  const separator = value.indexOf(":");
  const rawTree = value.slice(0, separator).trim();
  return { tree: rawTree === "Smithing" ? "Blacksmithing" : rawTree, name: value.slice(separator + 1).trim() };
}

function characteristicOptions(value: string): BackgroundGrant["characteristicOptions"] {
  if (value === "Any") return ["Agility", "Mind", "Strength"];
  return value.split(" or ") as BackgroundGrant["characteristicOptions"];
}

function parseRegularItem(value: string): { item: BackgroundItemGrant | null; gold: number } {
  const source = value.trim();
  const gold = source.match(/^(\d+)\s+(?:extra\s+)?gold coins$/i);
  if (gold) return { item: null, gold: Number(gold[1]) };
  const pet = source.match(/^(.*?)\s*\(pet\)$/i);
  if (pet) return { item: { catalogId:null, name:pet[1].trim().replace(/^./, (letter) => letter.toLocaleUpperCase()), quantity:1, slots:1, stackLimit:1, description:"Pet; does not occupy a character inventory slot.", valueGc:null, notes:"Placeholder until pets have their own records and backpacks." }, gold:0 };
  const lore = source.match(/^lore book\s*\((.*?)\)$/i);
  if (lore) return { item:catalogGrant(catalogItem("Lore Book"), 1, { name:`Lore Book - ${lore[1]}`, description:lore[1] }), gold:0 };
  const instrument = source.match(/^musical instrument\s*\((.*?)\)$/i);
  if (instrument) return { item:catalogGrant(catalogItem("Musical Instrument"), 1, { name:`Musical Instrument - ${instrument[1]}` }), gold:0 };
  const quantity = source.match(/^(.*?)\s*\((\d+)\)$/);
  const name = (quantity?.[1] ?? source).replace(/^extra\s+/i, "").trim();
  return { item:catalogGrant(catalogItem(name), Number(quantity?.[2] ?? 1)), gold:0 };
}

function equipmentGrants(value: string): { equipment: BackgroundItemGrant[]; extraGoldGc: number } {
  const marker = value.toLocaleLowerCase().indexOf("spellbooks:");
  const regular = marker >= 0 ? value.slice(0, marker).replace(/,\s*$/, "") : value;
  const spellbooks = marker >= 0 ? value.slice(marker + "spellbooks:".length) : "";
  const parsed = regular.split(",").map((entry) => entry.trim()).filter(Boolean).map(parseRegularItem);
  const equipment = parsed.flatMap((entry) => entry.item ? [entry.item] : []);
  for (const spell of spellbooks.split(",").map((entry) => entry.trim()).filter(Boolean)) {
    equipment.push(catalogGrant(catalogItem(`${spell} Spellbook`), 1));
  }
  return { equipment, extraGoldGc:parsed.reduce((sum, entry) => sum + entry.gold, 0) };
}

export const backgroundGrants: BackgroundGrant[] = backgroundEntries.map((background) => {
  const parsedEquipment = equipmentGrants(background.equipment);
  return {
    name:background.name,
    description:background.description,
    characteristicOptions:characteristicOptions(background.characteristic),
    stamina:background.stamina,
    trait:traitEntry(background.trait),
    expertises:expertiseEntries(background.expertises),
    ...parsedEquipment,
  };
});

export const backgroundGrantByName = new Map(backgroundGrants.map((grant) => [grant.name, grant]));

function mergeGrantItems(items: BackgroundItemGrant[]): BackgroundItemGrant[] {
  const merged = new Map<string, BackgroundItemGrant>();
  for (const item of items) {
    const key = [item.catalogId, item.name, item.description, item.notes].join("|");
    const current = merged.get(key);
    merged.set(key, current ? { ...current, quantity:current.quantity + item.quantity } : item);
  }
  return [...merged.values()];
}

export function startingInventoryForBackground(backgroundName: string, makeId: () => string = () => crypto.randomUUID()): CharacterInventory {
  const background = backgroundGrantByName.get(backgroundName);
  if (!background) return emptyInventory();
  const universal = universalEquipment.map((entry) => catalogGrant(catalogItem(entry.name), entry.quantity));
  const grants = mergeGrantItems([...universal, ...background.equipment]);
  const inventory = emptyInventory();
  inventory.items = grants.map((grant): InventoryItem => ({ ...grant, id:makeId(), contentsGc:null }));
  inventory.storage.unassigned = inventory.items.map((item) => item.id);
  return inventory;
}
