export const characterStatuses = ["active", "dead", "retired", "archived"] as const;
export type CharacterStatus = (typeof characterStatuses)[number];

export type ExpertiseEntry = { name: string; uses: number };
export type TraitEntry = { name: string; tree: string | null };

export type CharacterRecord = {
  id: string;
  campaignId: string;
  name: string;
  playerName: string | null;
  distinguishingFeature: string | null;
  background: string | null;
  status: CharacterStatus;
  agility: number;
  mind: number;
  strength: number;
  staminaCurrent: number;
  staminaMax: number;
  baseSpeed: number;
  txp: number;
  spentXp: number;
  goldGc: number;
  summary: string | null;
  connectionName: string | null;
  connectionRelationship: string | null;
  connectionBenefit: string | null;
  expertises: ExpertiseEntry[];
  traits: TraitEntry[];
};

export function parseNamedLines(value: string): string[] {
  return [...new Set(value.split(/\r?\n|,/).map((entry) => entry.trim()).filter(Boolean))];
}

export function parseExpertises(value: string): ExpertiseEntry[] {
  return parseNamedLines(value).map((entry) => {
    const match = entry.match(/^(.*?)(?:\s*[:(]\s*(\d+)\s*\)?)?$/);
    const name = match?.[1]?.trim() || entry;
    const uses = Number(match?.[2] ?? 1);
    return { name, uses: Math.max(1, Math.min(4, uses)) };
  });
}

export function parseTraits(value: string): TraitEntry[] {
  return parseNamedLines(value).map((entry) => {
    const separator = entry.indexOf(":");
    if (separator === -1) return { name: entry, tree: null };
    return {
      tree: entry.slice(0, separator).trim() || null,
      name: entry.slice(separator + 1).trim() || entry,
    };
  });
}

export function integerFromForm(value: FormDataEntryValue | null, fallback: number): number {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
