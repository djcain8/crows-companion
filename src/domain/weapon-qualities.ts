export type DismemberResult = { roll: string; result: string };

export type WeaponQuality = {
  id: string;
  name: string;
  description: string;
  dismemberResults?: DismemberResult[];
  note?: string;
};

export const weaponQualities: WeaponQuality[] = [
  { id:"brutal", name:"Brutal", description:"When you get a crit on an attack with this weapon, you deal twice as much damage with the attack as you normally would." },
  { id:"cumbersome", name:"Cumbersome", description:"The weapon only occupies 1 slot on your backpack or belt but requires 2 hand slots to wield." },
  { id:"disengage", name:"Disengage", description:"When you take the Shift maneuver while wielding this weapon, you can move 1 additional square as part of the maneuver. If you wield two weapons with this quality, the benefits stack." },
  {
    id:"dismember",
    name:"Dismember",
    description:"When you score a crit on an attack made with this weapon, it removes one of the target’s limbs. Roll on the Dismember table to determine the limb removed.",
    dismemberResults: [
      { roll:"1–2", result:"Arm: The attacker chooses which arm is removed. Any object held in the arm is dropped and any creature grabbed by the arm is no longer grabbed. If the creature uses the arm as part of a natural weapon attack, the attack takes a -1 damage penalty. With no arms remaining, they can’t make attacks or complete tasks that require arms." },
      { roll:"3–4", result:"Leg: The attacker chooses which leg is removed. The creature’s speed is reduced proportionally. With no legs remaining, they can’t stand and their speed is 0." },
      { roll:"5", result:"Arm or Leg: The attacker removes an arm or leg of their choice." },
      { roll:"6", result:"Head: The creature dies." },
    ],
    note:"For creatures whose limbs serve as both arms and legs, the Ref combines or adjusts the effects. Against a creature with no discernible anatomy, deal twice the normal crit damage instead of dismembering it.",
  },
  { id:"light", name:"Light", description:"When you hit with a melee attack while wielding two light weapons, deal additional damage equal to the unused weapon’s tier 2 result, without its Agility or Strength. An empty hand counts as a light weapon that can make unarmed strikes." },
  { id:"parry", name:"Parry X", description:"While you wield this weapon, it can absorb damage as if it were a shield and has AD equal to X. At 0 AD, the weapon takes a -1 damage penalty. Repair it like a shield using the Repair Armor rest activity." },
  { id:"pummeling", name:"Pummeling", description:"On a tier 3 attack against a creature your size or smaller, you can push them 1 square. On a crit, you can knock a target your size or smaller prone." },
  { id:"reload", name:"Reload", description:"You must use a maneuver to load 1 piece of ammunition before attacking with this weapon. After it attacks, it must be loaded again before it can make another attack." },
];

export const weaponQualityById = new Map(weaponQualities.map((quality) => [quality.id, quality]));

export function weaponQualityId(label: string): string | null {
  const normalized = label.toLocaleLowerCase().replace(/\s+\d+$/, "");
  return weaponQualityById.has(normalized) ? normalized : null;
}

