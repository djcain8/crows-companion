import type { CampaignOverview, InstitutionKind } from "@/domain/campaign";
import { hasSupabaseEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const institutionKinds = new Set<string>([
  "alchemist", "auction_house", "barracks", "beacon", "blacksmith", "bookseller",
  "crypt", "enchanter", "general_store", "inn", "stables", "temple",
]);

function assertInstitutionKind(kind: string): asserts kind is InstitutionKind {
  if (!institutionKinds.has(kind)) throw new Error(`Unknown institution kind: ${kind}`);
}

export async function getCampaignOverview(): Promise<CampaignOverview | null> {
  if (!hasSupabaseEnvironment()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, village_name, prosperity, current_day, current_cycle, treasury_gc, current_event, preset, institutions(id, kind, name, steward_name, level, status, details), characters(id, name, player_name, wounds, txp, gold_gc, summary)")
    .eq("preset", "gadwick_playtest")
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Unable to load campaign: ${error.message}`);
  if (!data) return null;

  const institutions = data.institutions.map((institution) => {
    assertInstitutionKind(institution.kind);
    return {
      id: institution.id,
      kind: institution.kind,
      name: institution.name,
      stewardName: institution.steward_name,
      level: institution.level,
      status: institution.status,
      details: (institution.details ?? {}) as Record<string, unknown>,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const characters = data.characters.map((character) => ({
    id: character.id,
    name: character.name,
    playerName: character.player_name,
    wounds: character.wounds,
    txp: character.txp,
    goldGc: character.gold_gc,
    summary: character.summary,
  }));

  return {
    id: data.id,
    name: data.name,
    villageName: data.village_name,
    prosperity: data.prosperity,
    day: data.current_day,
    cycle: data.current_cycle,
    treasuryGc: data.treasury_gc,
    currentEvent: data.current_event,
    preset: data.preset,
    institutions,
    characters,
  };
}
