import { afterEach, describe, expect, it } from "vitest";
import { getSupabaseEnvironment } from "./env";

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("getSupabaseEnvironment", () => {
  it("fails with an actionable message when configuration is absent", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getSupabaseEnvironment()).toThrow("Supabase is not configured");
  });

  it("returns configured public credentials", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "public-key";

    expect(getSupabaseEnvironment()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "public-key",
    });
  });
});

