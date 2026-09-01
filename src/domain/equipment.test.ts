import { describe, expect, it } from "vitest";
import { equipmentById, equipmentEntries } from "./equipment";

describe("equipment catalog", () => {
  it("has stable unique ids and valid physical values", () => {
    expect(new Set(equipmentEntries.map((entry) => entry.id)).size).toBe(equipmentEntries.length);
    for (const entry of equipmentEntries) {
      expect(entry.slots).toBeGreaterThanOrEqual(1);
      expect(entry.stack).toBeGreaterThanOrEqual(1);
      if (entry.priceGc !== null) expect(entry.priceGc).toBeGreaterThanOrEqual(0);
    }
  });

  it("contains the universal starting kit and models carried gold", () => {
    expect(equipmentById.get("coin-purse")).toMatchObject({ slots: 1, stack: 1 });
    expect(equipmentById.get("loose-gold")).toMatchObject({ slots: 1, stack: 250 });
    expect(equipmentById.get("knife")).toMatchObject({ slots: 1, stack: 2 });
    expect(equipmentById.get("rope")).toMatchObject({ slots: 1, stack: 1 });
    expect(equipmentById.get("ration")).toMatchObject({ slots: 1, stack: 6 });
  });

  it("captures adjacent-slot equipment from the starting backgrounds", () => {
    expect(equipmentById.get("11-foot-pole")?.slots).toBe(2);
    expect(equipmentById.get("light-armor")?.slots).toBe(2);
    expect(equipmentById.get("greataxe")?.slots).toBe(2);
    expect(equipmentById.get("tent")?.slots).toBe(2);
  });
});
