"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  characterStatuses,
  expertiseNames,
  integerFromForm,
  optionalText,
  parseExpertises,
  parseTraits,
  isBackground,
  inventorySlotCounts,
  type CharacterInventory,
  type InventorySlot,
  type CharacterStatus,
} from "@/domain/character";
import { createClient } from "@/lib/supabase/server";

const GADWICK_CAMPAIGN_ID = "00000000-0000-4000-8000-000000000001";

function inventorySlots(formData: FormData, group: keyof typeof inventorySlotCounts): InventorySlot[] {
  return Array.from({ length: inventorySlotCounts[group] }, (_, index) => {
    const item = optionalText(formData.get(`inventory_${group}_${index}`));
    const wound = group === "backpack" ? optionalText(formData.get(`inventory_${group}_${index}_wound`)) : null;
    return { item, wound };
  });
}

function inventoryValues(formData: FormData): CharacterInventory {
  return {
    hands: inventorySlots(formData, "hands"),
    belt: inventorySlots(formData, "belt"),
    backpack: inventorySlots(formData, "backpack"),
  };
}

function boundedInteger(formData: FormData, name: string, fallback: number, min: number, max: number) {
  return Math.min(max, Math.max(min, integerFromForm(formData.get(name), fallback)));
}

function characterValues(formData: FormData) {
  const name = optionalText(formData.get("name"));
  if (!name) throw new Error("Character name is required.");

  const requestedStatus = optionalText(formData.get("status"));
  const status: CharacterStatus = characterStatuses.includes(requestedStatus as CharacterStatus)
    ? (requestedStatus as CharacterStatus)
    : "active";

  const staminaMax = boundedInteger(formData, "stamina_max", 0, 0, 999);
  const txp = boundedInteger(formData, "txp", 0, 0, 9999999);
  const background = optionalText(formData.get("background"));
  if (background && !isBackground(background)) {
    throw new Error("Choose a background from the playtest list.");
  }
  const expertises = parseExpertises(optionalText(formData.get("expertises")) ?? "");
  if (expertises.some((expertise) => !expertiseNames.includes(expertise.name as (typeof expertiseNames)[number]))) {
    throw new Error("Choose expertises from the rules list.");
  }

  return {
    name,
    player_name: optionalText(formData.get("player_name")),
    distinguishing_feature: optionalText(formData.get("distinguishing_feature")),
    background,
    status,
    is_active: status === "active",
    agility: boundedInteger(formData, "agility", 0, -1, 4),
    mind: boundedInteger(formData, "mind", 0, -1, 4),
    strength: boundedInteger(formData, "strength", 0, -1, 4),
    stamina_current: boundedInteger(formData, "stamina_current", staminaMax, 0, 999),
    stamina_max: staminaMax,
    base_speed: boundedInteger(formData, "base_speed", 5, 0, 99),
    txp,
    spent_xp: boundedInteger(formData, "spent_xp", 0, 0, txp),
    gold_gc: boundedInteger(formData, "gold_gc", 0, 0, 999999999),
    summary: optionalText(formData.get("summary")),
    connection_name: optionalText(formData.get("connection_name")),
    connection_relationship: optionalText(formData.get("connection_relationship")),
    connection_benefit: optionalText(formData.get("connection_benefit")),
    expertises,
    traits: parseTraits(optionalText(formData.get("traits")) ?? ""),
  };
}

function finishMutation(message: string, characterId?: string) {
  revalidatePath("/");
  revalidatePath("/characters");
  const selectedCharacter = characterId ? `&character=${encodeURIComponent(characterId)}#character-${encodeURIComponent(characterId)}` : "";
  redirect(`/characters?notice=${encodeURIComponent(message)}${selectedCharacter}`);
}

function failureMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to save the character.";
}

function redirectFailure(error: unknown): never {
  redirect(`/characters?error=${encodeURIComponent(failureMessage(error))}`);
}

export async function createCharacter(formData: FormData) {
  try {
    const values = characterValues(formData);
    const supabase = await createClient();
    const { error } = await supabase.from("characters").insert({ campaign_id: GADWICK_CAMPAIGN_ID, ...values });
    if (error) throw new Error(`Unable to create character: ${error.message}`);
  } catch (error) {
    redirectFailure(error);
  }
  finishMutation("Crow added to Gadwick.");
}

export async function updateCharacter(characterId: string, formData: FormData) {
  try {
    const values = characterValues(formData);
    const supabase = await createClient();
    const { error } = await supabase.from("characters").update(values).eq("id", characterId).eq("campaign_id", GADWICK_CAMPAIGN_ID);
    if (error) throw new Error(`Unable to update character: ${error.message}`);
  } catch (error) {
    redirectFailure(error);
  }
  finishMutation("Character saved.", characterId);
}

export async function updatePlaySheet(characterId: string, staminaMax: number, formData: FormData) {
  try {
    const values = {
      stamina_current: boundedInteger(formData, "stamina_current", staminaMax, 0, staminaMax),
      gold_gc: boundedInteger(formData, "gold_gc", 0, 0, 999999999),
      inventory: inventoryValues(formData),
    };
    const supabase = await createClient();
    const { error } = await supabase
      .from("characters")
      .update(values)
      .eq("id", characterId)
      .eq("campaign_id", GADWICK_CAMPAIGN_ID);
    if (error) throw new Error(`Unable to update field kit: ${error.message}`);
  } catch (error) {
    redirectFailure(error);
  }
  finishMutation("Field kit saved.", characterId);
}
