import { describe, expect, it } from "vitest";
import { expertiseNames } from "./character";
import { backgroundEntries, startingTraitEntries } from "./compendium";
import { backgroundGrantByName, backgroundGrants, startingInventoryForBackground } from "./background-grants";

describe("background-assisted character creation", () => {
  it("resolves all 36 backgrounds into structured grants", () => {
    expect(backgroundGrants).toHaveLength(36);
    expect(backgroundGrants.map((grant) => grant.name)).toEqual(backgroundEntries.map((entry) => entry.name));
    expect(backgroundGrants.flatMap((grant) => grant.expertises).every((entry) => expertiseNames.includes(entry.name as (typeof expertiseNames)[number]))).toBe(true);
    const traits = new Set(startingTraitEntries.map((trait) => `${trait.tree}:${trait.name}`));
    expect(backgroundGrants.every((grant) => traits.has(`${grant.trait.tree}:${grant.trait.name}`))).toBe(true);
  });

  it("normalizes special configured items, pets, spellbooks, and gold", () => {
    expect(backgroundGrantByName.get("Cartographer")?.equipment.find((item) => item.catalogId === "lore-book")).toMatchObject({ name:"Lore Book - Historical Lore", description:"Historical Lore" });
    expect(backgroundGrantByName.get("Farmer")?.equipment.find((item) => item.name === "Goat")).toMatchObject({ catalogId:null, notes:expect.stringContaining("pets") });
    expect(backgroundGrantByName.get("Pyromancer")?.equipment.filter((item) => item.catalogId?.endsWith("spellbook"))).toHaveLength(2);
    expect(backgroundGrantByName.get("Merchant")?.extraGoldGc).toBe(50);
    expect(backgroundGrantByName.get("Keraunomancer")?.expertises.some((entry) => entry.name === "Blacksmithing")).toBe(true);
  });

  it("adds the universal kit and merges an extra knife", () => {
    let sequence = 0;
    const inventory = startingInventoryForBackground("Assassin", () => `item-${++sequence}`);
    expect(inventory.items.find((item) => item.catalogId === "knife")?.quantity).toBe(2);
    expect(inventory.items.find((item) => item.catalogId === "ration")?.quantity).toBe(6);
    expect(inventory.storage.unassigned).toEqual(inventory.items.map((item) => item.id));
  });
});
