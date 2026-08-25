import { describe, expect, it } from "vitest";
import { calculatePooledGold, isValidProsperity, type CharacterSummary } from "./campaign";

describe("isValidProsperity", () => {
  it.each([-10, 0, 10])("accepts %i", (value) => expect(isValidProsperity(value)).toBe(true));
  it.each([-11, 11, 1.5])("rejects %i", (value) => expect(isValidProsperity(value)).toBe(false));
});

describe("calculatePooledGold", () => {
  it("derives pooled gold without storing a second balance", () => {
    const character = (id: string, goldGc: number): CharacterSummary => ({
      id,
      name: id,
      playerName: null,
      wounds: 0,
      txp: 0,
      goldGc,
      summary: null,
    });

    expect(calculatePooledGold([character("crow-one", 125), character("crow-two", 75)])).toBe(200);
  });

  it("returns zero for an empty roster", () => {
    expect(calculatePooledGold([])).toBe(0);
  });
});
