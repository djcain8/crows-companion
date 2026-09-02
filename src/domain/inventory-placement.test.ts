import { describe, expect, it } from "vitest";
import { normalizeInventory } from "./character";
import { canMergeItems, canPlaceItem, inventoryPlacementErrors, mergeItems, placeItem, requiredSlots, splitItem, storeItem, swapItems } from "./inventory-placement";

const inventory = normalizeInventory({
  version:2,
  items:[
    { id:"tent", catalogId:"tent", name:"Tent", quantity:1, slots:2, stackLimit:1 },
    { id:"supplies", catalogId:null, name:"Crafting Supplies", quantity:10, slots:1, stackLimit:5 },
    { id:"ration", catalogId:"ration", name:"Ration", quantity:6, slots:1, stackLimit:6 },
  ],
  storage:{ townChest:[], unassigned:["tent", "supplies", "ration"] },
});

describe("inventory placement", () => {
  it("derives occupied slots from size, quantity, and stack limits", () => {
    expect(requiredSlots(inventory.items[0], "backpack")).toBe(2);
    expect(requiredSlots(inventory.items[1], "backpack")).toBe(2);
    expect(requiredSlots(inventory.items[2], "backpack")).toBe(1);
  });

  it("allows consecutive backpack placement to cross the visual row boundary", () => {
    expect(canPlaceItem(inventory, "tent", "backpack", 3)).toBe(true);
    expect(canPlaceItem(inventory, "tent", "backpack", 4)).toBe(true);
    expect(canPlaceItem(inventory, "tent", "backpack", 9)).toBe(false);
  });

  it("moves a whole item between carried slots and storage", () => {
    const placed = placeItem(inventory, "tent", "backpack", 1);
    expect(placed?.backpack.slice(1, 3).map((slot) => slot.itemId)).toEqual(["tent", "tent"]);
    expect(placed && inventoryPlacementErrors(placed)).toEqual([]);
    const stored = storeItem(placed!, "tent", "townChest");
    expect(stored.storage.townChest).toEqual(["tent"]);
    expect(stored.backpack.every((slot) => slot.itemId === null)).toBe(true);
  });

  it("swaps items when both fit in the vacated locations", () => {
    const tentPlaced = placeItem(inventory, "tent", "backpack", 0)!;
    const rationPlaced = placeItem(tentPlaced, "ration", "backpack", 3)!;
    const swapped = swapItems(rationPlaced, "ration", "tent")!;
    expect(swapped.backpack[0].itemId).toBe("ration");
    expect(swapped.backpack.slice(3, 5).map((slot) => slot.itemId)).toEqual(["tent", "tent"]);
    expect(inventoryPlacementErrors(swapped)).toEqual([]);
  });

  it("splits a quantity into a new unassigned item", () => {
    const placed = placeItem(inventory, "ration", "backpack", 0)!;
    const split = splitItem(placed, "ration", 1, "ration-single")!;
    expect(split.items.find((item) => item.id === "ration")?.quantity).toBe(5);
    expect(split.items.find((item) => item.id === "ration-single")?.quantity).toBe(1);
    expect(split.storage.unassigned).toContain("ration-single");
    expect(inventoryPlacementErrors(split)).toEqual([]);
  });

  it("merges a withdrawn item back into its compatible stack", () => {
    const placed = placeItem(inventory, "ration", "backpack", 0)!;
    const split = splitItem(placed, "ration", 1, "ration-single")!;
    const inHand = placeItem(split, "ration-single", "hands", 0)!;
    expect(canMergeItems(inHand.items[2], inHand.items[3])).toBe(true);
    const merged = mergeItems(inHand, "ration-single", "ration")!;
    expect(merged.items.find((item) => item.id === "ration")?.quantity).toBe(6);
    expect(merged.items.some((item) => item.id === "ration-single")).toBe(false);
    expect(merged.hands[0].itemId).toBeNull();
    expect(inventoryPlacementErrors(merged)).toEqual([]);
  });

  it("does not merge items with unique contents", () => {
    const first = { ...inventory.items[0], id: "purse-a", catalogId: "coin-purse", contentsGc: 10 };
    const second = { ...first, id: "purse-b", contentsGc: 20 };
    expect(canMergeItems(first, second)).toBe(false);
  });
});
