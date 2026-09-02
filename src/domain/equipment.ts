export const equipmentCategories = ["gear", "alchemy", "weapon", "armor", "spellbook"] as const;
export type EquipmentCategory = (typeof equipmentCategories)[number];

export type EquipmentEntry = {
  id: string;
  name: string;
  category: EquipmentCategory;
  slots: number;
  stack: number;
  priceGc: number | null;
  summary?: string;
  rules?: string;
  tags?: string[];
  attack?: WeaponAttack;
  crafting?: string;
};

export type WeaponAttack = {
  roll: string;
  range: string;
  tier2: string;
  tier3: string;
  qualities: string[];
};

function idFor(name: string) {
  return name.toLocaleLowerCase().replaceAll("’", "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function item(
  name: string,
  category: EquipmentCategory,
  priceGc: number | null,
  stack: number,
  summary: string | undefined,
  options: Partial<Pick<EquipmentEntry, "slots" | "rules" | "tags" | "attack" | "crafting">> = {},
): EquipmentEntry {
  return { id: idFor(name), name, category, slots: options.slots ?? 1, stack, priceGc, summary, rules: options.rules, tags: options.tags, attack: options.attack, crafting: options.crafting };
}

const weapon = (
  name: string,
  priceGc: number,
  stack: number,
  attack: WeaponAttack,
  options: Partial<Pick<EquipmentEntry, "slots" | "crafting">> = {},
) => item(name, "weapon", priceGc, stack, undefined, { ...options, attack });

export const equipmentEntries: EquipmentEntry[] = [
  item("11-Foot Pole", "gear", 5, 1, "An 11-foot-long wooden pole. Useful for poking, prodding, and improvising.", { slots: 2 }),
  item("Alchemist’s Tools", "gear", 15, 1, "Required to make crafting rolls for alchemy items.", { tags: ["crafting"] }),
  item("Animal Feed", "gear", 1, 6, "A day’s food for a pet, consumed during a rest.", { tags: ["pet", "consumable"] }),
  item("Ball Bearings", "gear", 5, 2, "A bag of 1,000 bearings that can cover a 2 × 2 area and trip creatures.", { tags: ["maneuver"] }),
  item("Bear Trap", "gear", 250, 1, "A 10-Stamina trap that damages and grabs a Large or smaller creature that steps on it.", { tags: ["maneuver"] }),
  item("Blacksmith’s Tools", "gear", 15, 1, "Required to make crafting rolls for blacksmithing items.", { tags: ["crafting"] }),
  item("Bucket", "gear", 2, 1, "Holds up to 3 gallons of liquid. Also good for hiding your face."),
  item("Card Deck", "gear", 1, 5, "A standard deck of 54 playing cards, including two jokers."),
  item("Chain", "gear", 5, 1, "A 10-foot length of iron chain."),
  item("Chalk", "gear", 1, 5, "Mark a route or leave messages on stone.", { tags: ["UD 1"] }),
  item("Coin Purse", "gear", 1, 1, "A purse occupies one inventory slot and holds up to 500 gold coins.", { tags: ["currency"] }),
  item("Loose Gold", "gear", null, 250, "One inventory slot holds up to 250 loose gold coins.", { tags: ["currency"] }),
  item("Compass", "gear", 10, 3, "Gain +1 on a test related to the guide travel role while carrying it.", { tags: ["travel"] }),
  item("Cook’s Utensils", "gear", 15, 1, "Required for special rest activities in the Travel trait tree.", { tags: ["rest"] }),
  item("Crowbar", "gear", 10, 1, "An iron bar used for prying."),
  item("Grappling Hook", "gear", 10, 1, "Combine with rope to create a two-slot item that is easier to hurl and secure."),
  item("Holy Symbol", "gear", 15, 2, "A symbol of your god. It can occupy the neck worn slot, but is not magical."),
  item("Journal", "gear", 2, 1, "A bound journal with 200 blank pages."),
  item("Ladder", "gear", 30, 1, "A collapsible 10-foot ladder.", { slots: 2 }),
  item("Lantern", "gear", 25, 2, "Sheds light 10/10 and can be refueled with oil.", { tags: ["UD 2", "light"] }),
  item("Lockpick Set", "gear", 25, 1, "Avoid the -1 penalty on tests made to pick locks."),
  item("Lore Book", "gear", 50, 1, "Study during a rest to gain one temporary use of its named expertise.", { tags: ["rest"] }),
  item("Magnifying Glass", "gear", 100, 2, "Inspect minute visual details of nearby creatures and objects."),
  item("Merchant’s Scales", "gear", 50, 1, "Determine the weight of Tiny objects and cooperative Tiny creatures."),
  item("Mirror", "gear", 100, 2, "A hand mirror useful for looking around corners and at your own mug."),
  item("Musical Instrument", "gear", 100, 1, "A portable instrument. Playing it requires both hand slots."),
  item("Net", "gear", 5, 1, "Hurl during a Grab maneuver for an edge; the target takes a bane to escape. It has 5 Stamina.", { tags: ["maneuver"] }),
  item("Oil Flask", "gear", 5, 2, "Refuel a lantern or spread flammable oil over a 2 × 2 area.", { tags: ["maneuver"] }),
  item("Padlock", "gear", 25, 3, "An iron padlock with a key."),
  item("Pot", "gear", 5, 1, "An iron cooking pot with a heavy lid."),
  item("Quill & Inkpot", "gear", 5, 5, "For writing stuff down."),
  item("Ration", "gear", 2, 6, "A day’s food, consumed during a rest to avoid starvation.", { tags: ["consumable"] }),
  item("Hearty Ration", "gear", 2, 6, "During a rest, consume this ration to remove one additional wound.", { tags: ["consumable"] }),
  item("Rope", "gear", 2, 1, "Fifty feet of rope. A secured rope requires no test to climb."),
  item("Shovel", "gear", 10, 1, "Dig holes, or use it as an improvised crowbar at the risk of breaking it."),
  item("Soap", "gear", 1, 3, "Clean a mess, leave messages, whittle shapes, or lubricate locks and bindings.", { tags: ["UD 1"] }),
  item("Spyglass", "gear", 100, 2, "Makes distant things appear three times closer."),
  item("String", "gear", 1, 1, "One thousand feet of string."),
  item("Surgical Kit", "gear", 100, 1, "Use while tending wounds so the target loses one additional wound.", { tags: ["UD 1", "rest"] }),
  item("Tent", "gear", 100, 1, "A waterproof canvas tent that sleeps up to four humans.", { slots: 2 }),
  item("Torch", "gear", 2, 2, "Sheds light 5/5.", { tags: ["UD 1", "light"] }),
  item("Whistle", "gear", 5, 5, "Create a loud noise audible from 20 squares away.", { tags: ["maneuver"] }),

  item("Acid Vial", "alchemy", 10, 5, "Destroy a cubic foot of mundane matter, or throw it as a ranged attack.", { tags: ["maneuver", "ranged 5"] }),
  item("Gluepot", "alchemy", 125, 2, "Spread glue over a 2 × 2 area; creatures entering it make a Strength RR.", { tags: ["maneuver"] }),
  item("Healing Potion", "alchemy", 100, 5, "Regain 1d6 Stamina, or remove one wound while at maximum Stamina.", { tags: ["maneuver", "consumable"] }),
  item("Poison Vial", "alchemy", 10, 5, "Apply to a weapon or one ammunition; its next damaging hit can weaken the target.", { tags: ["maneuver", "consumable"] }),
  item("Rage Potion", "alchemy", 250, 5, "Gain 5 AD and +2 melee damage while you keep attacking each round.", { tags: ["maneuver", "consumable"] }),
  item("Smoke Bomb", "alchemy", 50, 2, "Create a 3-cube area of heavy concealment that gradually dissipates.", { tags: ["maneuver", "ranged 10"] }),

  weapon("Hammer", 10, 2, { roll:"2d10 + Agility or Strength", range:"Melee 1 / Ranged 5", tier2:"2 + Agility or Strength", tier3:"4 + Agility or Strength", qualities:["Bashing", "Light", "Pummeling"] }),
  weapon("Mace", 12, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"3 + Strength", tier3:"6 + Strength", qualities:["Bashing", "Pummeling"] }),
  weapon("Knife", 10, 2, { roll:"2d10 + Agility or Strength", range:"Melee 1 / Ranged 5", tier2:"2 + Agility or Strength", tier3:"4 + Agility or Strength", qualities:["Slashing", "Light", "Disengage", "Parry 2"] }),
  weapon("Sword", 12, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"3 + Strength", tier3:"6 + Strength", qualities:["Slashing", "Disengage", "Parry 4"] }),
  weapon("Handaxe", 10, 2, { roll:"2d10 + Agility or Strength", range:"Melee 1 / Ranged 5", tier2:"2 + Agility or Strength", tier3:"5 + Agility or Strength", qualities:["Chopping", "Light", "Dismember"] }),
  weapon("Axe", 12, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"3 + Strength", tier3:"7 + Strength", qualities:["Chopping", "Dismember"] }),
  weapon("Stiletto", 10, 2, { roll:"2d10 + Agility or Strength", range:"Melee 1 / Ranged 5", tier2:"2 + Agility or Strength", tier3:"5 + Agility or Strength", qualities:["Stabbing", "Light", "Brutal"] }),
  weapon("Spear", 12, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"3 + Strength", tier3:"7 + Strength", qualities:["Stabbing", "Brutal"] }),
  weapon("Flail", 15, 1, { roll:"2d10 + Strength", range:"Melee 2", tier2:"3 + Strength", tier3:"6 + Strength", qualities:["Bashing", "Pummeling"] }, { slots:2 }),
  weapon("Maul", 15, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"4 + Strength", tier3:"8 + Strength", qualities:["Bashing", "Pummeling"] }, { slots:2 }),
  weapon("Glaive", 15, 1, { roll:"2d10 + Strength", range:"Melee 2", tier2:"3 + Strength", tier3:"6 + Strength", qualities:["Slashing", "Disengage", "Parry 6"] }, { slots:2 }),
  weapon("Greatsword", 15, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"4 + Strength", tier3:"8 + Strength", qualities:["Slashing", "Disengage", "Parry 6"] }, { slots:2 }),
  weapon("Halberd", 15, 1, { roll:"2d10 + Strength", range:"Melee 2", tier2:"3 + Strength", tier3:"7 + Strength", qualities:["Chopping", "Dismember"] }, { slots:2 }),
  weapon("Greataxe", 15, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"4 + Strength", tier3:"9 + Strength", qualities:["Chopping", "Dismember"] }, { slots:2 }),
  weapon("Pike", 15, 1, { roll:"2d10 + Strength", range:"Melee 2", tier2:"3 + Strength", tier3:"7 + Strength", qualities:["Stabbing", "Brutal"] }, { slots:2 }),
  weapon("Warpick", 15, 1, { roll:"2d10 + Strength", range:"Melee 1", tier2:"4 + Strength", tier3:"9 + Strength", qualities:["Stabbing", "Brutal"] }, { slots:2 }),
  weapon("Shortbow", 10, 1, { roll:"2d10 + Agility", range:"Ranged 10", tier2:"2 + Agility", tier3:"4 + Agility", qualities:["Bow", "Cumbersome"] }),
  weapon("Longbow", 12, 1, { roll:"2d10 + Agility", range:"Ranged 20", tier2:"3 + Agility", tier3:"6 + Agility", qualities:["Bow"] }, { slots:2 }),
  weapon("Crossbow", 15, 1, { roll:"2d10 + Agility", range:"Ranged 15", tier2:"4 + Agility", tier3:"8 + Agility", qualities:["Bow", "Reload"] }, { slots:2 }),
  item("Quiver of Arrows", "weapon", 5, 1, "Ammunition for shortbows and longbows.", { tags: ["UD 2", "ammunition"] }),
  item("Case of Crossbow Bolts", "weapon", 5, 1, "Ammunition for crossbows.", { tags: ["UD 2", "ammunition"] }),
  item("Miner’s Pick", "gear", 10, 1, "Useful for breaking stone and the occasional skull.", { tags: ["improvised weapon"] }),

  item("Shield", "armor", 15, 1, undefined, { tags: ["AD 5"] }),
  item("Light Armor", "armor", 50, 1, undefined, { slots: 2, tags: ["AD 5"] }),
  item("Medium Armor", "armor", 150, 1, undefined, { slots: 3, tags: ["AD 10"] }),
  item("Heavy Armor", "armor", 400, 1, undefined, { slots: 4, tags: ["AD 15"] }),

  item("Alteration Stone", "gear", 15, 1, "Choose one benefit when created: no need to eat or drink, no need to breathe, or light 5/5.", { tags: ["trait item"] }),
  ...[
    ["Animal Form", "Alteration", "Gain the statistics and form of an animal."],
    ["Repair", "Alteration", "Restore Stamina to a damaged object."],
    ["Take Shape", "Alteration", "Attempt to change your form to match a creature."],
    ["Minor Blessing", "Benefaction", "Bless one or more creatures."],
    ["Minor Healing", "Benefaction", "Restore Stamina to one creature."],
    ["Minor Ward", "Benefaction", "Grant Armor Defense to one creature."],
    ["Jaunt", "Conjuration", "Teleport yourself a distance based on the casting."],
    ["Summon Object", "Conjuration", "Create a temporary mundane object in an open inventory slot."],
    ["Teleport Object", "Conjuration", "Teleport a Tiny object, including into an open inventory slot."],
    ["Create Water", "Elemental", "Create water that fills a vessel or falls from the air."],
    ["Fire Hands", "Elemental", "A close-range fire attack."],
    ["Fire Lance", "Elemental", "A ranged fire attack."],
    ["Spark", "Elemental", "A ranged lightning attack that can target two creatures."],
    ["Stream", "Elemental", "A line of water that damages creatures in its area."],
    ["Thunder", "Elemental", "A ranged thunder attack that pushes its target."],
    ["Cacophony", "Illusion", "Create a phantom noise that persists for a duration."],
    ["Light", "Illusion", "Make an object shed light for a duration."],
    ["Minor Phantasm", "Illusion", "Create a silent phantom image within a space."],
    ["Bone Capture", "Necromancy", "A ranged necromancy attack that can knock the target prone."],
    ["Minor Curse", "Necromancy", "Bond a target, with a stronger casting applying it twice."],
    ["Monster Sense", "Necromancy", "Sense the locations of nearby creatures that are not humans or animals."],
  ].map(([name, discipline, summary]) => item(`${name} Spellbook`, "spellbook", 250, 1, summary, { tags: ["rank 0", discipline, "UD 1"] })),
].sort((a, b) => a.name.localeCompare(b.name));

export const equipmentById = new Map(equipmentEntries.map((entry) => [entry.id, entry]));
