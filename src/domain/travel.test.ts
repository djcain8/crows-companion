import { describe, expect, it } from "vitest";
import { emptyInventory } from "./character";
import { carriedRations, clampTravelCoordinate, effectiveTravelSpeed, partyTravelSummary, type TravelCharacter } from "./travel";

function character(overrides: Partial<TravelCharacter> = {}): TravelCharacter {
  return { id: "crow-1", name: "Crow", playerName: null, status: "active", baseSpeed: 5, inventory: emptyInventory(), ...overrides };
}

describe("travel party summaries", () => {
  it("counts only catalog rations carried by the traveler", () => {
    const inventory = emptyInventory();
    inventory.items = [
      { id: "carried", catalogId: "ration", name: "Ration", quantity: 6, slots: 1, stackLimit: 6, description: null, valueGc: null, contentsGc: null, notes: null },
      { id: "chest", catalogId: "ration", name: "Ration", quantity: 4, slots: 1, stackLimit: 6, description: null, valueGc: null, contentsGc: null, notes: null },
      { id: "custom", catalogId: null, name: "Rations probably", quantity: 99, slots: 1, stackLimit: 99, description: null, valueGc: null, contentsGc: null, notes: null },
    ];
    inventory.belt[0].itemId = "carried";
    inventory.storage.townChest.push("chest", "custom");
    expect(carriedRations(character({ inventory }))).toBe(6);
  });

  it("derives wound-adjusted lowest speed and party rests", () => {
    const slowInventory = emptyInventory();
    slowInventory.items = [{ id: "loot", catalogId: null, name: "Loot", quantity: 1, slots: 1, stackLimit: 1, description: null, valueGc: null, contentsGc: null, notes: null }];
    slowInventory.backpack[0] = { itemId: "loot", wound: true };
    const fast = character({ id: "fast", baseSpeed: 7 });
    const slow = character({ id: "slow", baseSpeed: 5, inventory: slowInventory });
    expect(effectiveTravelSpeed(slow)).toBe(4);
    expect(partyTravelSummary([fast, slow], [fast.id, slow.id]).lowestSpeed).toBe(4);
  });
});

describe("travel coordinates", () => {
  it("clamps marker positions to the map", () => {
    expect(clampTravelCoordinate(-1)).toBe(0.01);
    expect(clampTravelCoordinate(2)).toBe(0.99);
    expect(clampTravelCoordinate(Number.NaN)).toBe(0.5);
  });
});
