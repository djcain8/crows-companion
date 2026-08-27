import { describe, expect, it } from "vitest";
import { clampCoordinate } from "./expedition";

describe("expedition map coordinates", () => {
  it("keeps token centers on the map", () => {
    expect(clampCoordinate(-1)).toBe(0.02);
    expect(clampCoordinate(0.42)).toBe(0.42);
    expect(clampCoordinate(2)).toBe(0.98);
    expect(clampCoordinate(Number.NaN)).toBe(0.5);
  });
});
