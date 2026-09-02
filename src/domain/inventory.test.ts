import { describe, expect, it } from "vitest";
import { normalizeInventory } from "./character";
import { rebuildCarriedInventory, type InventoryDraft } from "./inventory";

function blankDraft(): InventoryDraft {
  return {
    hands: Array.from({ length:2 }, () => ({ name:null, wound:false })),
    belt: Array.from({ length:4 }, () => ({ name:null, wound:false })),
    backpack: Array.from({ length:10 }, () => ({ name:null, wound:false })),
  };
}

describe("structured inventory editing", () => {
  it("upgrades legacy slots and attaches catalog metadata without merging items", () => {
    const current = normalizeInventory({ hands:[{ item:"Sword" }], belt:[{ item:"Sword" }] });
    const draft = blankDraft();
    draft.hands[0].name = "Sword";
    draft.belt[0].name = "Sword";
    const next = rebuildCarriedInventory(current, draft, () => "unused");

    expect(next.items).toHaveLength(2);
    expect(next.items.map((item) => item.id)).toEqual(["legacy-hands-1", "legacy-belt-1"]);
    expect(next.items.every((item) => item.catalogId === "sword" && item.stackLimit === 1)).toBe(true);
  });

  it("creates custom items and preserves wounds", () => {
    const current = normalizeInventory({});
    const draft = blankDraft();
    draft.backpack[3] = { name:"Cursed Teapot", wound:true };
    const next = rebuildCarriedInventory(current, draft, () => "new-item");

    expect(next.backpack[3]).toEqual({ itemId:"new-item", wound:true });
    expect(next.items[0]).toMatchObject({ id:"new-item", catalogId:null, name:"Cursed Teapot", slots:1, stackLimit:1 });
  });

  it("retains items in storage during a carried-slot save", () => {
    const current = normalizeInventory({
      version:2,
      items:[{ id:"stored", name:"Town Sword", catalogId:null, quantity:1, slots:1, stackLimit:1 }],
      storage:{ townChest:["stored"], unassigned:[] },
    });
    const next = rebuildCarriedInventory(current, blankDraft(), () => "unused");

    expect(next.storage.townChest).toEqual(["stored"]);
    expect(next.items[0]?.name).toBe("Town Sword");
  });
});

