export const institutionKinds = [
  "alchemist",
  "auction_house",
  "barracks",
  "beacon",
  "blacksmith",
  "bookseller",
  "crypt",
  "enchanter",
  "general_store",
  "inn",
  "stables",
  "temple",
] as const;

export type InstitutionKind = (typeof institutionKinds)[number];

export type Campaign = {
  id: string;
  name: string;
  villageName: string;
  prosperity: number;
  day: number;
  cycle: number;
  treasuryGc: number;
};

export type CharacterSummary = {
  id: string;
  name: string;
  playerName: string | null;
  wounds: number;
  txp: number;
  goldGc: number;
  summary: string | null;
};

export type InstitutionSummary = {
  id: string;
  kind: InstitutionKind;
  name: string;
  stewardName: string | null;
  level: number;
  status: string;
  details: Record<string, unknown>;
};

export type CampaignOverview = Campaign & {
  currentEvent: string | null;
  preset: string | null;
  characters: CharacterSummary[];
  institutions: InstitutionSummary[];
};

export function isValidProsperity(value: number): boolean {
  return Number.isInteger(value) && value >= -10 && value <= 10;
}

export function calculatePooledGold(characters: CharacterSummary[]): number {
  return characters.reduce((total, character) => total + character.goldGc, 0);
}
