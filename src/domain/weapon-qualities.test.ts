import { describe, expect, it } from "vitest";
import { weaponQualities, weaponQualityId } from "./weapon-qualities";

describe("weapon qualities", () => {
  it("resolves parameterized Parry labels", () => {
    expect(weaponQualityId("Parry 6")).toBe("parry");
    expect(weaponQualityId("Slashing")).toBeNull();
  });

  it("includes every quality and the Dismember table", () => {
    expect(weaponQualities).toHaveLength(8);
    expect(weaponQualities.find((quality) => quality.id === "dismember")?.dismemberResults).toHaveLength(4);
  });
});
