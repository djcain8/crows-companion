import { inventorySpeedPenalty, type CharacterRecord } from "./character";

export const TRAVEL_JOURNEY_ID = "00000000-0000-4000-8000-000000000201";

export type TravelJourney = {
  id: string;
  name: string;
  originLabel: string | null;
  destinationLabel: string | null;
  markerX: number;
  markerY: number;
  markerVisible: boolean;
  currentDayId: string;
};

export type TravelPace = "slow" | "normal" | "fast";

export type TravelDay = {
  id: string;
  dayNumber: number;
  phase: "plan" | "assign" | "resolve" | "travel" | "rest" | "complete";
  pace: TravelPace | null;
  followsRoad: boolean;
};

export type TravelCharacter = Pick<CharacterRecord, "id" | "name" | "playerName" | "status" | "baseSpeed" | "inventory">;

export function carriedRations(character: TravelCharacter): number {
  const carriedIds = new Set([...character.inventory.hands, ...character.inventory.belt, ...character.inventory.backpack].flatMap((slot) => slot.itemId ? [slot.itemId] : []));
  return character.inventory.items.filter((item) => item.catalogId === "ration" && carriedIds.has(item.id)).reduce((total, item) => total + item.quantity, 0);
}

export function effectiveTravelSpeed(character: TravelCharacter): number {
  return Math.max(0, character.baseSpeed - inventorySpeedPenalty(character.inventory));
}

export function partyTravelSummary(characters: TravelCharacter[], memberIds: string[]) {
  const selected = characters.filter((character) => memberIds.includes(character.id));
  const totalRations = selected.reduce((total, character) => total + carriedRations(character), 0);
  return {
    selected,
    totalRations,
    restsRemaining: selected.length ? totalRations / selected.length : null,
    lowestSpeed: selected.length ? Math.min(...selected.map(effectiveTravelSpeed)) : null,
  };
}

const paceRules: Record<TravelPace, { hexes: number; encounterNumber: number; testModifier: "edge" | "bane" | null }> = {
  slow: { hexes: 1, encounterNumber: 8, testModifier: "edge" },
  normal: { hexes: 2, encounterNumber: 7, testModifier: null },
  fast: { hexes: 3, encounterNumber: 6, testModifier: "bane" },
};

export function speedHexAdjustment(lowestSpeed: number | null): number {
  if (lowestSpeed === null) return 0;
  if (lowestSpeed <= 3) return -1;
  if (lowestSpeed >= 10) return 2;
  if (lowestSpeed >= 7) return 1;
  return 0;
}

export function travelPlanSummary(pace: TravelPace | null, lowestSpeed: number | null, followsRoad: boolean) {
  if (!pace) return null;
  const rule = paceRules[pace];
  const speedAdjustment = speedHexAdjustment(lowestSpeed);
  const roadAdjustment = followsRoad ? 1 : 0;
  return {
    baseHexes: rule.hexes,
    speedAdjustment,
    roadAdjustment,
    plannedHexes: Math.max(0, rule.hexes + speedAdjustment + roadAdjustment),
    dayEncounterNumber: rule.encounterNumber - roadAdjustment,
    restEncounterNumber: rule.encounterNumber - roadAdjustment,
    testModifier: rule.testModifier,
  };
}

export function clampTravelCoordinate(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(0.99, Math.max(0.01, value));
}
