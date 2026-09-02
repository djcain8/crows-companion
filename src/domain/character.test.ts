import { describe, expect, it } from "vitest";
import { integerFromForm, inventorySpeedPenalty, isBackground, normalizeInventory, optionalText, parseExpertises, parseNamedLines, parseTraits } from "./character";

describe("character form parsing", () => {
  it("normalizes and deduplicates flexible lists", () => {
    expect(parseNamedLines("Search, Navigate\nSearch\n  ")).toEqual(["Search", "Navigate"]);
  });

  it("parses expertise uses as non-negative integers without enforcing advancement rules", () => {
    expect(parseExpertises("Search: 2\nNavigate (9)\nLore\nStealth: 0\nLift: -2")).toEqual([
      { name: "Search", uses: 2 },
      { name: "Navigate", uses: 9 },
      { name: "Lore", uses: 1 },
      { name: "Stealth", uses: 0 },
      { name: "Lift", uses: 0 },
    ]);
  });

  it("parses optional trait tree prefixes", () => {
    expect(parseTraits("Travel: Orienteering\nMidnight Oil")).toEqual([
      { tree: "Travel", name: "Orienteering" },
      { tree: null, name: "Midnight Oil" },
    ]);
  });

  it("handles integers and optional text without producing NaN or empty strings", () => {
    expect(integerFromForm("12", 0)).toBe(12);
    expect(integerFromForm("twelve", 5)).toBe(5);
    expect(optionalText("  ")).toBeNull();
    expect(optionalText(" Crow ")).toBe("Crow");
  });

  it("recognizes only playtest backgrounds", () => {
    expect(isBackground("Cartographer")).toBe(true);
    expect(isBackground("Cartographer!!!")).toBe(false);
  });

  it("migrates legacy text slots into structured one-slot custom items", () => {
    const inventory = normalizeInventory({
      hands: [{ item: " Sword ", wound: true }],
      backpack: [null, { item: null, wound: true }],
    });

    expect(inventory.hands).toHaveLength(2);
    expect(inventory.belt).toHaveLength(4);
    expect(inventory.backpack).toHaveLength(10);
    expect(inventory).toMatchObject({ version: 2, storage: { townChest: [], unassigned: [] } });
    expect(inventory.hands[0]).toEqual({ itemId: "legacy-hands-1", wound: false });
    expect(inventory.items[0]).toEqual({ id:"legacy-hands-1", catalogId:null, name:"Sword", quantity:1, slots:1, stackLimit:1, description:null, valueGc:null, contentsGc:null, notes:null });
    expect(inventory.backpack[1]).toEqual({ itemId: null, wound: true });
  });

  it("penalizes Speed once for each backpack slot containing loot and a Wound", () => {
    const inventory = normalizeInventory({ backpack: [
      { item: "Rope", wound: true },
      { item: null, wound: true },
      { item: "Torch", wound: false },
      { item: "Gem", wound: true },
    ] });

    expect(inventorySpeedPenalty(inventory)).toBe(2);
  });

  it("normalizes structured inventory and enforces one storage location", () => {
    const inventory = normalizeInventory({
      version: 2,
      items: [
        { id:"rope", catalogId:"rope", name:"Rope", quantity:1, slots:1, stackLimit:1 },
        { id:"torch", catalogId:"torch", name:"Torch", quantity:2, slots:1, stackLimit:2 },
        { id:"gem", catalogId:null, name:"Strange Gem", quantity:1, slots:1, stackLimit:1 },
      ],
      hands: [{ itemId:"rope" }],
      storage: { townChest:["rope", "torch"], unassigned:["torch", "gem", "missing"] },
    });

    expect(inventory.hands[0].itemId).toBe("rope");
    expect(inventory.storage.townChest).toEqual(["torch"]);
    expect(inventory.storage.unassigned).toEqual(["gem"]);
    expect(inventory.items.find((item) => item.id === "torch")?.quantity).toBe(2);
  });
});
