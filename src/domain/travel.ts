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
export type TravelRole = "supporter" | "guide" | "scout" | "tracker" | "sit_out";
export type TravelRoleTask = { id: string; name: string; intent: string; test: string };

export type TravelAssignment = {
  id: string;
  travelDayId: string;
  characterId: string;
  role: TravelRole;
  task: string | null;
};

export const travelRoleTasks: Record<Exclude<TravelRole, "sit_out">, TravelRoleTask[]> = {
  supporter: [
    { id: "fight_miasma", name: "Fight the Miasma", intent: "Bolster the group's resistance to the Miasma.", test: "2d10 + Mind" },
    { id: "make_camp", name: "Make Camp", intent: "Prepare an efficient or well-protected campsite.", test: "2d10 + Speed" },
    { id: "support_everyone", name: "Support Everyone", intent: "Aid up to four allies with their travel roles.", test: "2d10 + Mind or Speed" },
  ],
  guide: [
    { id: "follow_normal_route", name: "Follow Normal Route", intent: "Take a straightforward path without risking getting lost.", test: "2d10 + Mind" },
    { id: "follow_safe_route", name: "Follow Safe Route", intent: "Trade movement for a safer route.", test: "2d10 + Mind" },
    { id: "follow_shortcut", name: "Follow Shortcut", intent: "Risk getting lost to make better time.", test: "2d10 + Mind" },
  ],
  scout: [
    { id: "scout_for_danger", name: "Scout for Danger", intent: "Look ahead for danger and improve Travel EN.", test: "2d10 + Agility or Mind" },
    { id: "scout_for_shelter", name: "Scout for Shelter", intent: "Find a safer place to camp and improve Rest EN.", test: "2d10 + Mind" },
    { id: "treasure_hunt", name: "Treasure Hunt", intent: "Search for something useful or valuable.", test: "2d10 + Speed" },
  ],
  tracker: [
    { id: "forage", name: "Forage", intent: "Search for edible vegetation and gain rations.", test: "2d10 + Mind" },
    { id: "hunt", name: "Hunt", intent: "Hunt edible game for rations and animal parts.", test: "2d10 + Agility" },
    { id: "track_specific_creature", name: "Track Specific Creature", intent: "Search for a specific animal, monster, or human.", test: "2d10 + Mind" },
  ],
};

export const travelRoleLimits: Record<Exclude<TravelRole, "sit_out">, number> = { supporter: 3, guide: 1, scout: 3, tracker: 3 };

export function travelAssignmentsReady(memberIds: string[], assignments: TravelAssignment[]): boolean {
  const partyAssignments = assignments.filter((assignment) => memberIds.includes(assignment.characterId));
  if (!memberIds.length || partyAssignments.filter((assignment) => assignment.role === "guide").length !== 1) return false;
  if (Object.entries(travelRoleLimits).some(([role, limit]) => partyAssignments.filter((assignment) => assignment.role === role).length > limit)) return false;
  return memberIds.every((characterId) => {
    const assignment = partyAssignments.find((candidate) => candidate.characterId === characterId);
    return Boolean(assignment && (assignment.role === "sit_out" || assignment.task));
  });
}

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
