import { describe, expect, it } from "vitest";
import { integerFromForm, optionalText, parseExpertises, parseNamedLines, parseTraits } from "./character";

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
});
