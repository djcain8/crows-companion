export type BackgroundEntry = {
  name: string;
  description: string;
  characteristic: string;
  stamina: number;
  trait: string;
  expertises: string;
  equipment: string;
  page: number;
};

export type StartingTraitEntry = { name: string; tree: string; effect: string; page: number };

export function traitId(name: string): string {
  return `trait-${name.toLocaleLowerCase().replaceAll("’", "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

export const backgroundEntries: BackgroundEntry[] = [
  { name:"Acolyte of the Gardner", description:"You served the god of nature.", characteristic:"Mind", stamina:5, trait:"Enchantment: Material Transfer", expertises:"Athletics, Handle Pet, Nature Lore, Navigate, Religious Lore, Benefaction (2 uses), Elemental (2 uses)", equipment:"Holy symbol, torch, spellbooks: fire hands, minor healing, spark", page:2 },
  { name:"Acolyte of the Healer", description:"You served the god of healing.", characteristic:"Mind", stamina:7, trait:"Benefaction: Enhanced Healing", expertises:"Alchemy, Lift, Religious Lore (2 uses), Benefaction (2 uses)", equipment:"Holy symbol, surgical kit, torch, spellbooks: minor blessing, minor healing", page:2 },
  { name:"Acolyte of the Smith", description:"You served the god of creativity.", characteristic:"Mind", stamina:7, trait:"Enchantment: Hands for Tools", expertises:"Alchemy, Blacksmithing (2 uses), Enchanting, Religious Lore, Benefaction", equipment:"Blacksmith’s tools, holy symbol, torch, spellbooks: minor healing, summon object", page:2 },
  { name:"Acolyte of the Three", description:"You served the god of death, greed, and knowledge.", characteristic:"Mind or Strength", stamina:7, trait:"Necromancy: Soul Absorption", expertises:"Magic Lore, Monster Lore, Religious Lore, Necromancy (2 uses), Chopping", equipment:"Axe, torch, spellbooks: bone capture, minor curse, monster sense", page:2 },
  { name:"Acolyte of the Warrior", description:"You served the god of war.", characteristic:"Mind or Strength", stamina:9, trait:"Benefaction: First Responder", expertises:"Religious Lore, Benefaction, Chopping", equipment:"Axe, holy symbol, torch, spellbooks: minor healing, minor ward", page:2 },
  { name:"Alchemist", description:"You crafted and sold acids, potions, and bombs.", characteristic:"Mind", stamina:5, trait:"Alchemy: Midnight Oil", expertises:"Alchemy (2 uses), Enchanting, Magic Lore, Monster Lore, Nature Lore, Search, Thievery (2 uses)", equipment:"Acid vial, alchemist’s tools, bucket, healing potion, lantern, oil flask, smoke bomb", page:2 },
  { name:"Apprentice Mage", description:"You studied several magic disciplines under a more experienced tutor.", characteristic:"Mind", stamina:5, trait:"Alteration: Alteration Stone", expertises:"Enchanting, Magic Lore, Monster Lore, Alteration (2 uses), Conjuration, Elemental (2 uses), Illusion", equipment:"Alteration stone, spellbooks: jaunt, light, spark, take shape, thunder", page:2 },
  { name:"Archer", description:"You served as a soldier or watch member specially trained with a bow.", characteristic:"Agility", stamina:7, trait:"Archery: Point Blank", expertises:"Athletics, Stealth (2 uses), Bow (2 uses), Unarmed", equipment:"Bear trap, quiver of arrows, shortbow, spyglass, torch", page:2 },
  { name:"Assassin", description:"You were a contract killer or served a higher purpose in a shady organization.", characteristic:"Agility", stamina:5, trait:"Thievery: Sieze the Advantage", expertises:"Athletics, Gymnastics, Stealth (2 uses), Thievery, Bow (2 uses), Slashing (2 uses)", equipment:"Extra knife, poison vial, quiver of arrows, shortbow, torch", page:3 },
  { name:"Beggar", description:"You relied on strangers’ kindness to scrape together enough to live.", characteristic:"Any", stamina:7, trait:"Leverage: More for Less", expertises:"Endurance, Lift, Search (2 uses), Stealth (2 uses)", equipment:"Gluepot, padlock, pot, string, tent, torch", page:3 },
  { name:"Blacksmith", description:"You forged and sold items made from metal.", characteristic:"Strength", stamina:7, trait:"Smithing: Double Duty", expertises:"Blacksmithing (2 uses), Endurance, Lift, Thievery, Bashing", equipment:"Bear trap, blacksmith’s tools, chain, maul, torch", page:3 },
  { name:"Bodyguard", description:"You protected a person of importance.", characteristic:"Strength", stamina:9, trait:"Armor: Interposing Arm", expertises:"Endurance, Search, Slashing", equipment:"Ball bearings, light armor, shield, sword, torch", page:3 },
  { name:"Cartographer", description:"You mapped villages, ruins, and wilderness so others could find their way.", characteristic:"Mind", stamina:7, trait:"Travel: Orienteering", expertises:"Historical Lore, Monster Lore, Nature Lore, Navigate (2 uses), Search", equipment:"Compass, journal, lantern, lore book (Historical Lore), oil flask, quill and inkpot", page:3 },
  { name:"Conjurer", description:"You studied conjuration magic.", characteristic:"Mind", stamina:7, trait:"Conjuration: Jumper", expertises:"Handle Pet, Magic Lore, Monster Lore, Navigate, Conjuration (2 uses)", equipment:"Chain, torch, spellbooks: jaunt, summon object, teleport object", page:3 },
  { name:"Cook", description:"You worked as a cook at a tavern or organization.", characteristic:"Any", stamina:7, trait:"Camping: Hearty Meals", expertises:"Alchemy, Endurance, Lift, Nature Lore (2 uses), Slashing", equipment:"Cook’s utensils, hearty ration (2), pot, torch", page:3 },
  { name:"Duelist", description:"You dedicated your youth to fencing in noble courts.", characteristic:"Agility", stamina:9, trait:"Slashing: Finesse the Blade", expertises:"Gymnastics, Historical Lore, Slashing", equipment:"Light armor, lore book (Historical Lore), mirror, sword, torch", page:3 },
  { name:"Entertainer", description:"You were an acrobat, dancer, and/or musician.", characteristic:"Agility", stamina:5, trait:"Camping: Song of Rest", expertises:"Athletics (2 uses), Endurance, Gymnastics (2 uses), Handle Pet, Historical Lore, Thievery (2 uses)", equipment:"11-foot pole, mirror, musical instrument (lute), smoke bomb, torch", page:4 },
  { name:"Executioner", description:"You carried out capital punishment.", characteristic:"Strength", stamina:9, trait:"Chopping: Chop ‘Em Down", expertises:"Lift, Chopping, Unarmed", equipment:"Chain, greataxe, ladder, padlock, torch", page:4 },
  { name:"Farmer", description:"You plowed fields and raised animals.", characteristic:"Strength", stamina:7, trait:"Pets: Buddy", expertises:"Blacksmithing, Endurance, Handle Pet (2 uses), Lift, Nature Lore", equipment:"11-foot pole, animal feed (6), goat (pet), pot, torch", page:4 },
  { name:"Gladiator", description:"You fought deadly battles for others’ entertainment.", characteristic:"Strength", stamina:9, trait:"Stabbing: Bury the Point", expertises:"Athletics, Lift, Stabbing", equipment:"Light armor, mirror, pike, rage potion, torch", page:4 },
  { name:"Hunter", description:"You tracked animals in the wild and foraged for food.", characteristic:"Agility", stamina:5, trait:"Travel: Foraging Expert", expertises:"Athletics, Handle Pet (2 uses), Nature Lore (2 uses), Navigate, Stealth, Bow (2 uses)", equipment:"Animal feed (6), bear trap, dog (pet), quiver of arrows, shortbow, torch", page:4 },
  { name:"Hydromancer", description:"You learned elemental spells that create and harness water.", characteristic:"Mind", stamina:7, trait:"Elemental: Water Shield", expertises:"Alchemy, Athletics, Enchanting, Magic Lore, Elemental (2 uses)", equipment:"Gluepot, journal, quill and inkpot, torch, spellbooks: create water, stream", page:4 },
  { name:"Illusionist", description:"You studied illusion magic.", characteristic:"Mind", stamina:5, trait:"Illusion: Lasting Illusion", expertises:"Magic Lore (2 uses), Monster Lore, Search, Stealth (2 uses), Thievery, Illusion (2 uses)", equipment:"Card deck, smoke bomb, whistle, spellbooks: cacophony, light, minor phantasm", page:4 },
  { name:"Keraunomancer", description:"You learned elemental spells that create and harness lightning and thunder.", characteristic:"Mind", stamina:7, trait:"Elemental: Hurl the Storm", expertises:"Blacksmith, Enchanting, Magic Lore (2 uses), Elemental (2 uses), Bashing", equipment:"Mace, net, torch, spellbooks: spark, thunder", page:4 },
  { name:"Knight", description:"You served a noble as a knight, or served no one as a hedge knight.", characteristic:"Strength", stamina:9, trait:"Slashing: Swordplay", expertises:"Handle Pet, Historical Lore, Slashing", equipment:"Animal feed (6), greatsword, lantern, light armor, oil flask, riding horse (pet)", page:5 },
  { name:"Merchant", description:"You traveled from village to village trading your wares.", characteristic:"Mind", stamina:7, trait:"Camping: Plotting", expertises:"Historical Lore (2 uses), Lift, Navigate, Search, Thievery", equipment:"Journal, lantern, merchant’s scales, oil flask, quill and inkpot, 50 extra gold coins", page:5 },
  { name:"Miner", description:"You worked in mines, digging and hauling ore.", characteristic:"Strength", stamina:7, trait:"Leverage: Lasting Light", expertises:"Athletics, Endurance (2 uses), Lift, Navigate, Stabbing", equipment:"Chalk, grappling hook, lantern, oil flask, shovel, warpick", page:5 },
  { name:"Noble", description:"You grew up in a family with wealth and power.", characteristic:"Agility or Mind", stamina:7, trait:"Reputation: Call Daddy", expertises:"Handle Pet, Historical Lore (2 uses), Religious Lore, Stealth, Bow", equipment:"Animal feed (6), lantern, lore book (Historical Lore), oil flask, riding horse (pet), 50 gold coins", page:5 },
  { name:"Pugilist", description:"You made a living battling it out with bare knuckles.", characteristic:"Agility or Strength", stamina:9, trait:"Unarmed: Pack a Punch", expertises:"Athletics, Unarmed (2 uses)", equipment:"Chalk, light armor, lore book (Monster Lore), net, rage potion, torch", page:5 },
  { name:"Pyromancer", description:"You learned elemental spells that create and harness fire.", characteristic:"Mind", stamina:5, trait:"Elemental: Burn Baby", expertises:"Alchemy, Enchanting, Historical Lore, Magic Lore (2 uses), Elemental (2 uses)", equipment:"Magnifying glass, smoke bomb, string, torch, spellbooks: fire hands, fire lance", page:5 },
  { name:"Sage", description:"You studied all subjects with a tutor, many books, or both.", characteristic:"Mind", stamina:5, trait:"Knowledge: Cram", expertises:"Historical Lore (2 uses), Magic Lore, Monster Lore (2 uses), Nature Lore, Navigate, Religious Lore, Thievery", equipment:"Ball bearings, journal, lore book (Monster Lore), lore book (Nature Lore), quill and inkpot, torch", page:5 },
  { name:"Soldier", description:"You served in an army protecting others from wilderness threats.", characteristic:"Strength", stamina:9, trait:"Armor: Stalwart", expertises:"Endurance, Bow, Stabbing", equipment:"Light armor, quiver of arrows, shortbow, spear, torch", page:5 },
  { name:"Thief", description:"You burgled places for money, alone or as part of a guild.", characteristic:"Agility", stamina:5, trait:"Thievery: Stealthy", expertises:"Athletics, Gymnastics (2 uses), Search (2 uses), Stealth (2 uses), Thievery (2 uses)", equipment:"Crowbar, extra knife, grappling hook, lockpick set, smoke bomb, torch", page:6 },
  { name:"Tinkerer", description:"You created magical and mechanical inventions.", characteristic:"Mind", stamina:5, trait:"Knowledge: Improvised Equipment", expertises:"Alchemy (2 uses), Blacksmithing (2 uses), Enchanting, Search, Thievery (2 uses), Chopping", equipment:"Alchemist’s tools, blacksmith’s tools, handaxe, lockpick set, soap, torch", page:6 },
  { name:"Transmuter", description:"You studied alteration magic.", characteristic:"Mind", stamina:5, trait:"Alteration: Lasting Alteration", expertises:"Alchemy, Blacksmithing, Enchanting (2 uses), Magic Lore (2 uses), Thievery, Alteration (2 uses)", equipment:"Chalk, torch, spellbooks: jaunt, animal form, repair, take shape", page:6 },
  { name:"Village Watch", description:"You kept a settlement safe.", characteristic:"Strength", stamina:9, trait:"Armor: Stand Strong", expertises:"Athletics, Search, Stabbing", equipment:"Chain, lantern, light armor, oil flask, padlock, pike, whistle", page:6 },
];

export const startingTraitEntries: StartingTraitEntry[] = [
  { name:"Midnight Oil", tree:"Alchemy", effect:"When crafting an alchemy item during the Craft Equipment rest activity, make two crafting rolls for that item or make a second roll for a different alchemy item.", page:8 },
  { name:"Lasting Alteration", tree:"Alteration", effect:"Add 1 UD to the duration of alteration spells whose duration is listed in UD.", page:9 },
  { name:"Alteration Stone", tree:"Alteration", effect:"As a rest activity, create an alteration stone. It disappears if you create another one.", page:9 },
  { name:"Point Blank", tree:"Archery", effect:"Ranged attacks you make with a bow ignore the -1 penalty for having an enemy within 1 square of you.", page:10 },
  { name:"Interposing Arm", tree:"Armor", effect:"While wielding a shield with at least 1 AD, use your reaction when an adjacent creature is attacked to apply the damage to your shield before the target.", page:11 },
  { name:"Stalwart", tree:"Armor", effect:"While wearing armor, reduce forced movement by 1. Tier 1-2 attack results and tier 2-3 RR results can’t knock you prone.", page:11 },
  { name:"Stand Strong", tree:"Armor", effect:"While wearing armor, gain a +1 bonus on Strength RRs.", page:11 },
  { name:"Enhanced Healing", tree:"Benefaction", effect:"When your benefaction spell restores Stamina, the target regains additional Stamina equal to your Mind.", page:13 },
  { name:"First Responder", tree:"Benefaction", effect:"When a creature in range takes damage and you have an equipped benefaction spell that restores Stamina, use your reaction to cast it on that creature.", page:13 },
  { name:"Double Duty", tree:"Blacksmithing", effect:"When crafting a blacksmithing item during the Craft Equipment rest activity, make two crafting rolls for it or make a second roll for another blacksmithing item.", page:14 },
  { name:"Hearty Meals", tree:"Camping", effect:"As a rest activity, use cook’s utensils to turn a normal ration into a hearty ration.", page:15 },
  { name:"Plotting", tree:"Camping", effect:"As a rest activity, choose up to three pieces of equipment you can touch. Before your next rest, the first test using each piece gains +2.", page:15 },
  { name:"Song of Rest", tree:"Camping", effect:"As a rest activity, play an instrument. Each ally who rests with you is blessed at the end of the rest.", page:15 },
  { name:"Chop ‘Em Down", tree:"Chopping", effect:"After a chopping weapon crit, roll twice on the Dismember table and choose either result.", page:16 },
  { name:"Jumper", tree:"Conjuration", effect:"When a conjuration spell teleports a target, increase the teleport distance by your Mind. This stacks with Long Distance Jump.", page:17 },
  { name:"Burn Baby", tree:"Elemental", effect:"When an elemental spell damages a target, it deals additional damage equal to your Mind.", page:18 },
  { name:"Hurl the Storm", tree:"Elemental", effect:"Increase the range of ranged elemental spells by a number of squares equal to your Mind.", page:18 },
  { name:"Water Shield", tree:"Elemental", effect:"When you cast an elemental spell, you can gain AD equal to your Mind until the end of a rest.", page:18 },
  { name:"Material Transfer", tree:"Enchantment", effect:"As a rest activity, touch two armor pieces or weapons made from different valid materials; their materials are magically swapped.", page:19 },
  { name:"Hands for Tools", tree:"Enchantment", effect:"You don’t need tools to make crafting rolls for alchemy, blacksmithing, or enchanting items.", page:19 },
  { name:"Lasting Illusion", tree:"Illusion", effect:"Add 1 UD to the duration of illusion spells whose duration is listed in UD.", page:20 },
  { name:"Cram", tree:"Knowledge", effect:"When reading a lore book as a rest activity, read a second lore book during the same activity.", page:21 },
  { name:"Improvised Equipment", tree:"Knowledge", effect:"As a rest activity, create an object usable as any mundane item. It is destroyed after completing one task; an item with a duration instead lasts 1 DT.", page:21 },
  { name:"More for Less", tree:"Leverage", effect:"When rolling the final remaining UD of mundane equipment, the UD is lost only on a result of 1.", page:22 },
  { name:"Lasting Light", tree:"Leverage", effect:"Mundane light sources you carry have their UD maximum increased by 1.", page:22 },
  { name:"Soul Absorption", tree:"Necromancy", effect:"When your necromancy spell kills a creature, gain AD equal to your Mind until you finish a rest.", page:23 },
  { name:"Buddy", tree:"Pets", effect:"As a rest activity, choose pets you own up to your Mind (minimum 1). Gain +2 on Mind tests to interact with them until you use this activity again.", page:24 },
  { name:"Call Daddy", tree:"Reputation", effect:"Choose a village merchant. Treat their level as 1 higher when buying from them. You can change the merchant once each cycle.", page:25 },
  { name:"Finesse the Blade", tree:"Slashing", effect:"Use Agility instead of Strength when attacking and dealing damage with a sword.", page:26 },
  { name:"Swordplay", tree:"Slashing", effect:"Add your Strength to the Parry quality of slashing weapons you wield.", page:26 },
  { name:"Bury the Point", tree:"Stabbing", effect:"After hitting with a melee stabbing weapon, you can deal double damage; the weapon becomes useless until repaired with a rest activity.", page:27 },
  { name:"Sieze the Advantage", tree:"Thievery", effect:"When an Agility weapon attack with at least one edge and no banes hits, deal additional damage equal to twice your Agility.", page:28 },
  { name:"Stealthy", tree:"Thievery", effect:"When testing to hide or sneak without armor, roll twice and choose either result.", page:28 },
  { name:"Orienteering", tree:"Travel", effect:"When testing for the guide role while carrying a compass, roll twice and choose either result.", page:29 },
  { name:"Foraging Expert", tree:"Travel", effect:"When a tracker-role test gains at least 1 ration, gain 1 additional ration. This stacks with Food Finder.", page:29 },
  { name:"Pack a Punch", tree:"Unarmed", effect:"An empty hand slot becomes a Light unarmed strike dealing 2 + Strength or Agility on tier 2 and 4 + Strength or Agility on tier 3.", page:30 },
];
