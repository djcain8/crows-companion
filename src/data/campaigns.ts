import type { CampaignOverview, InstitutionKind } from "@/domain/campaign";
import { hasSupabaseEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { characterStatuses, type CharacterRecord, type CharacterStatus, type ExpertiseEntry, type TraitEntry } from "@/domain/character";

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

function isCharacterStatus(value: string): value is CharacterStatus {
  return characterStatuses.includes(value as CharacterStatus);
}

export async function getCharacterRegistry(): Promise<CharacterRecord[]> {
  if (!hasSupabaseEnvironment()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select("id, campaign_id, name, player_name, distinguishing_feature, background, status, agility, mind, strength, stamina_current, stamina_max, base_speed, txp, spent_xp, gold_gc, summary, connection_name, connection_relationship, connection_benefit, expertises, traits")
    .eq("campaign_id", "00000000-0000-4000-8000-000000000001")
    .order("sort_order")
    .order("created_at");

  if (error) throw new Error(`Unable to load characters: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    campaignId: row.campaign_id,
    name: row.name,
    playerName: row.player_name,
    distinguishingFeature: row.distinguishing_feature,
    background: row.background,
    status: isCharacterStatus(row.status) ? row.status : "archived",
    agility: row.agility,
    mind: row.mind,
    strength: row.strength,
    staminaCurrent: row.stamina_current,
    staminaMax: row.stamina_max,
    baseSpeed: row.base_speed,
    txp: row.txp,
    spentXp: row.spent_xp,
    goldGc: row.gold_gc,
    summary: row.summary,
    connectionName: row.connection_name,
    connectionRelationship: row.connection_relationship,
    connectionBenefit: row.connection_benefit,
    expertises: row.expertises as ExpertiseEntry[],
    traits: row.traits as TraitEntry[],
  }));
}
