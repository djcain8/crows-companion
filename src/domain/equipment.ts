export const equipmentCategories = ["gear", "alchemy", "weapon", "armor", "spellbook"] as const;
export type EquipmentCategory = (typeof equipmentCategories)[number];

export type EquipmentEntry = {
  id: string;
  name: string;
  category: EquipmentCategory;
  slots: number;
  stack: number;
  priceGc: number | null;
  summary: string;
  rules?: string;
  tags?: string[];
};

function idFor(name: string) {
  return name.toLocaleLowerCase().replaceAll("’", "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function item(
  name: string,
  category: EquipmentCategory,
  priceGc: number | null,
  stack: number,
  summary: string,
  options: Partial<Pick<EquipmentEntry, "slots" | "rules" | "tags">> = {},
): EquipmentEntry {
  return { id: idFor(name), name, category, slots: options.slots ?? 1, stack, priceGc, summary, rules: options.rules, tags: options.tags };
}

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

  item("Knife", "weapon", 10, 2, "A light slashing weapon that can be thrown.", { tags: ["melee 1", "ranged 5", "Light", "Disengage", "Parry 2"] }),
  item("Sword", "weapon", 12, 1, "A slashing weapon suited to disengaging and parrying.", { tags: ["melee 1", "Disengage", "Parry 4"] }),
  item("Handaxe", "weapon", 10, 2, "A light chopping weapon that can be thrown and dismember foes.", { tags: ["melee 1", "ranged 5", "Light", "Dismember"] }),
  item("Axe", "weapon", 12, 1, "A chopping weapon built to dismember foes.", { tags: ["melee 1", "Dismember"] }),
  item("Mace", "weapon", 12, 1, "A bashing weapon that can pummel foes.", { tags: ["melee 1", "Pummeling"] }),
  item("Spear", "weapon", 12, 1, "A brutal stabbing weapon.", { tags: ["melee 1", "Brutal"] }),
  item("Maul", "weapon", 15, 1, "A two-slot bashing weapon that pummels foes.", { slots: 2, tags: ["melee 1", "Pummeling"] }),
  item("Greataxe", "weapon", 15, 1, "A two-slot chopping weapon with exceptional damage.", { slots: 2, tags: ["melee 1", "Dismember"] }),
  item("Greatsword", "weapon", 15, 1, "A two-slot slashing weapon with strong defensive reach.", { slots: 2, tags: ["melee 1", "Disengage", "Parry 6"] }),
  item("Pike", "weapon", 15, 1, "A two-slot brutal stabbing weapon with reach.", { slots: 2, tags: ["melee 2", "Brutal"] }),
  item("Shortbow", "weapon", 10, 1, "A ranged bow that is cumbersome at close quarters.", { tags: ["ranged 10", "Cumbersome"] }),
  item("Quiver of Arrows", "weapon", 5, 1, "Ammunition for shortbows and longbows.", { tags: ["UD 2", "ammunition"] }),
  item("Miner’s Pick", "weapon", 10, 1, "Useful for breaking stone and the occasional skull.", { tags: ["improvised weapon"] }),
  item("Warpick", "weapon", 10, 1, "A miner’s pick used as a stabbing weapon.", { tags: ["melee 1", "Stabbing"] }),

  item("Shield", "armor", 15, 1, "A wielded shield with 5 Armor Defense.", { tags: ["AD 5"] }),
  item("Light Armor", "armor", 50, 1, "A suit of cloth, hide, or leather armor with 5 Armor Defense.", { slots: 2, tags: ["AD 5"] }),
  item("Medium Armor", "armor", 150, 1, "A suit of chain or scale armor with 10 Armor Defense.", { slots: 3, tags: ["AD 10"] }),
  item("Heavy Armor", "armor", 400, 1, "A suit of plate, ring, or splint armor with 15 Armor Defense.", { slots: 4, tags: ["AD 15"] }),

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
