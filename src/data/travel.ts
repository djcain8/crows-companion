import { getCharacterRegistry } from "./campaigns";
import { createClient } from "@/lib/supabase/server";
import { TRAVEL_JOURNEY_ID, type TravelDay, type TravelJourney } from "@/domain/travel";

export async function getTravelBoard() {
  const supabase = await createClient();
  const [journeyResult, partyResult, characters] = await Promise.all([
    supabase.from("travel_journeys").select("id, name, origin_label, destination_label, marker_x, marker_y, marker_visible, current_day_id").eq("id", TRAVEL_JOURNEY_ID).single(),
    supabase.from("travel_party_members").select("character_id").eq("journey_id", TRAVEL_JOURNEY_ID),
    getCharacterRegistry(),
  ]);

  if (journeyResult.error) throw new Error(`Unable to load the active journey: ${journeyResult.error.message}`);
  if (partyResult.error) throw new Error(`Unable to load the traveling party: ${partyResult.error.message}`);

  const row = journeyResult.data;
  const dayResult = await supabase.from("travel_days").select("id, day_number, phase, pace, follows_road").eq("id", row.current_day_id).single();
  if (dayResult.error) throw new Error(`Unable to load the current travel day: ${dayResult.error.message}`);

  const journey: TravelJourney = {
    id: row.id,
    name: row.name,
    originLabel: row.origin_label,
    destinationLabel: row.destination_label,
    markerX: row.marker_x,
    markerY: row.marker_y,
    markerVisible: row.marker_visible,
    currentDayId: row.current_day_id,
  };
  const day: TravelDay = {
    id: dayResult.data.id,
    dayNumber: dayResult.data.day_number,
    phase: dayResult.data.phase as TravelDay["phase"],
    pace: dayResult.data.pace as TravelDay["pace"],
    followsRoad: dayResult.data.follows_road,
  };

  return { journey, day, memberIds: partyResult.data.map((member) => member.character_id), characters: characters.filter((character) => character.status === "active") };
}
