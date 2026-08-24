import { describe, expect, it } from "vitest";
import { isValidProsperity } from "./campaign";

describe("isValidProsperity", () => {
  it.each([-10, 0, 10])("accepts %i", (value) => expect(isValidProsperity(value)).toBe(true));
  it.each([-11, 11, 1.5])("rejects %i", (value) => expect(isValidProsperity(value)).toBe(false));
});

