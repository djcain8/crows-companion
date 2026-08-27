import { describe, expect, it } from "vitest";
import { backgroundEntries, startingTraitEntries } from "./compendium";
import { backgrounds } from "./character";

describe("background compendium", () => {
  it("covers every character background exactly once", () => {
    expect(backgroundEntries).toHaveLength(backgrounds.length);
    expect(backgroundEntries.map((entry) => entry.name)).toEqual([...backgrounds]);
    expect(new Set(backgroundEntries.map((entry) => entry.name)).size).toBe(backgrounds.length);
  });

  it("includes a definition for every granted starting Trait", () => {
    const includedTraits = new Set(startingTraitEntries.map((entry) => entry.name));
    const grantedTraits = backgroundEntries.map((entry) => entry.trait.split(": ")[1]);
    expect(startingTraitEntries).toHaveLength(36);
    expect(grantedTraits.every((trait) => includedTraits.has(trait))).toBe(true);
  });
});
