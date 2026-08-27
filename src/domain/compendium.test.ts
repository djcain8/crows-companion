import { describe, expect, it } from "vitest";
import { backgroundEntries } from "./compendium";
import { backgrounds } from "./character";

describe("background compendium", () => {
  it("covers every character background exactly once", () => {
    expect(backgroundEntries).toHaveLength(backgrounds.length);
    expect(backgroundEntries.map((entry) => entry.name)).toEqual([...backgrounds]);
    expect(new Set(backgroundEntries.map((entry) => entry.name)).size).toBe(backgrounds.length);
  });
});
