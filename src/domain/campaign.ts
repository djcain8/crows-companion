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

export function isValidProsperity(value: number): boolean {
  return Number.isInteger(value) && value >= -10 && value <= 10;
}

