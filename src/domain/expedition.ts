export type ExpeditionMap = {
  id: string;
  name: string;
  roomNumber: number;
  imagePath: string;
};

export type MapToken = {
  id: string;
  expeditionId: string;
  mapId: string;
  characterId: string | null;
  kind: "player" | "enemy";
  label: string;
  color: string;
  x: number;
  y: number;
};

export type ExpeditionCharacter = { id: string; name: string; color: string };

export function clampCoordinate(value: number): number {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(0.98, Math.max(0.02, value));
}
