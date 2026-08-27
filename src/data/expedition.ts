import { createClient } from "@/lib/supabase/server";
import type { ExpeditionCharacter, ExpeditionMap, MapToken } from "@/domain/expedition";

export const FIRST_EXPEDITION_ID = "00000000-0000-4000-8000-000000000101";

const playerColors = ["#62aee8", "#e7b64f", "#75c878", "#b986e8", "#ef7d73", "#61c9c4"];

export async function getExpeditionBoard(): Promise<{
  maps: ExpeditionMap[];
  tokens: MapToken[];
  characters: ExpeditionCharacter[];
}> {
  const supabase = await createClient();
  const [mapsResult, tokensResult, charactersResult] = await Promise.all([
    supabase.from("expedition_maps").select("id, name, room_number, image_path").eq("expedition_id", FIRST_EXPEDITION_ID).order("room_number"),
    supabase.from("map_tokens").select("id, expedition_id, map_id, character_id, kind, label, color, x, y").eq("expedition_id", FIRST_EXPEDITION_ID).order("created_at"),
    supabase.from("characters").select("id, name").eq("campaign_id", "00000000-0000-4000-8000-000000000001").eq("status", "active").order("sort_order").order("created_at"),
  ]);

  if (mapsResult.error) throw new Error(`Unable to load expedition maps: ${mapsResult.error.message}`);
  if (tokensResult.error) throw new Error(`Unable to load map tokens: ${tokensResult.error.message}`);
  if (charactersResult.error) throw new Error(`Unable to load expedition characters: ${charactersResult.error.message}`);

  return {
    maps: mapsResult.data.map((map) => ({ id: map.id, name: map.name, roomNumber: map.room_number, imagePath: map.image_path })),
    tokens: tokensResult.data.map((token) => ({
      id: token.id,
      expeditionId: token.expedition_id,
      mapId: token.map_id,
      characterId: token.character_id,
      kind: token.kind === "player" ? "player" : "enemy",
      label: token.label,
      color: token.color,
      x: token.x,
      y: token.y,
    })),
    characters: charactersResult.data.map((character, index) => ({ id: character.id, name: character.name, color: playerColors[index % playerColors.length] })),
  };
}
