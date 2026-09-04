"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { carriedRations, effectiveTravelSpeed, partyTravelSummary, TRAVEL_JOURNEY_ID, type TravelCharacter, type TravelDay, type TravelJourney } from "@/domain/travel";
import { TravelMap } from "./travel-map";

const phases = ["Plan", "Assign", "Resolve", "Travel", "Camp & Rest"];

export function TravelBoard({ journey: initialJourney, day, memberIds: initialMemberIds, characters }: { journey: TravelJourney; day: TravelDay; memberIds: string[]; characters: TravelCharacter[] }) {
  const [supabase] = useState(() => createClient());
  const [journey, setJourney] = useState(initialJourney);
  const [memberIds, setMemberIds] = useState(initialMemberIds);
  const [error, setError] = useState<string | null>(null);
  const partyDialog = useRef<HTMLDialogElement>(null);
  const summary = partyTravelSummary(characters, memberIds);
  const rationTone = summary.restsRemaining === null ? "" : summary.restsRemaining < 1 ? "critical" : summary.restsRemaining <= 2 ? "warning" : "";

  const refreshJourney = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("travel_journeys").select("marker_x, marker_y, marker_visible, destination_label").eq("id", TRAVEL_JOURNEY_ID).single();
    if (queryError) return setError(queryError.message);
    setJourney((current) => ({ ...current, markerX: data.marker_x, markerY: data.marker_y, markerVisible: data.marker_visible, destinationLabel: data.destination_label }));
  }, [supabase]);

  const refreshParty = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("travel_party_members").select("character_id").eq("journey_id", TRAVEL_JOURNEY_ID);
    if (queryError) return setError(queryError.message);
    setMemberIds((data ?? []).map((member) => member.character_id));
  }, [supabase]);

  useEffect(() => {
    const channel = supabase.channel("travel-board")
      .on("postgres_changes", { event: "*", schema: "public", table: "travel_journeys", filter: `id=eq.${TRAVEL_JOURNEY_ID}` }, refreshJourney)
      .on("postgres_changes", { event: "*", schema: "public", table: "travel_party_members", filter: `journey_id=eq.${TRAVEL_JOURNEY_ID}` }, refreshParty)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [refreshJourney, refreshParty, supabase]);

  async function toggleCharacter(characterId: string) {
    setError(null);
    const response = memberIds.includes(characterId)
      ? await supabase.from("travel_party_members").delete().eq("journey_id", TRAVEL_JOURNEY_ID).eq("character_id", characterId)
      : await supabase.from("travel_party_members").insert({ journey_id: TRAVEL_JOURNEY_ID, character_id: characterId });
    if (response.error) return setError(response.error.message);
    await refreshParty();
  }

  async function updateMarker(next: { x?: number; y?: number; visible?: boolean }) {
    const optimistic = { ...journey, markerX: next.x ?? journey.markerX, markerY: next.y ?? journey.markerY, markerVisible: next.visible ?? journey.markerVisible };
    setJourney(optimistic);
    const { error: updateError } = await supabase.from("travel_journeys").update({ marker_x: optimistic.markerX, marker_y: optimistic.markerY, marker_visible: optimistic.markerVisible, updated_at: new Date().toISOString() }).eq("id", TRAVEL_JOURNEY_ID);
    if (updateError) { setError(updateError.message); await refreshJourney(); }
  }

  return <section className="journey-console" aria-labelledby="journey-title">
    <header className="journey-heading"><div><p>Current journey</p><h2 id="journey-title">{journey.name}</h2></div><div className="journey-day"><span>Travel day</span><strong>{day.dayNumber}</strong></div></header>
    <section className="journey-vitals" aria-label="Journey status">
      <article><span>Traveling</span><strong>{summary.selected.length} {summary.selected.length === 1 ? "Crow" : "Crows"}</strong><small>{summary.selected.length ? summary.selected.map((crow) => crow.name).join(", ") : "Choose today's party"}</small></article>
      <article className={`ration-vital ${rationTone}`}><span>Rations</span><strong>{summary.selected.length ? summary.totalRations : "—"}</strong><small>{summary.restsRemaining === null ? "Party rests remaining" : `${summary.restsRemaining.toFixed(summary.restsRemaining % 1 ? 1 : 0)} party rests remaining`}</small></article>
      <article><span>Lowest speed</span><strong>{summary.lowestSpeed ?? "—"}</strong><small>{summary.selected.length ? "Includes carried-wound penalties" : "No travelers selected"}</small></article>
      <article className="day-en"><span>Day · Travel EN</span><strong>—</strong><small>Set today's pace</small></article><article className="night-en"><span>Night · Rest EN</span><strong>—</strong><small>Set today's pace</small></article>
      <article><span>Position</span><strong>{journey.markerVisible ? journey.originLabel ?? "Known" : "Lost"}</strong><small>Party marker {journey.markerVisible ? "visible" : "hidden"}</small></article>
    </section>
    {error && <p className="travel-error" role="alert">Travel update failed: {error}</p>}
    <ol className="travel-stepper" aria-label="Travel day phases">{phases.map((phase, index) => <li className={index === 0 ? "active" : ""} aria-current={index === 0 ? "step" : undefined} key={phase}><b>{index + 1}</b><span>{phase}</span></li>)}</ol>
    <div className="travel-layout"><section className="phase-workspace" aria-labelledby="phase-title"><header><div><p>Phase 1 of 5</p><h2 id="phase-title">Plan the day</h2></div><span>Day · Travel</span></header>
      <div className="phase-section party-preview"><div><span className="section-number">01</span><div><h3>Who is traveling?</h3><p>Select attending Crows from the registry. Absent and test characters stay safely out of the day.</p></div></div><button type="button" onClick={() => partyDialog.current?.showModal()}>{summary.selected.length ? "Edit party" : "Choose party"}</button></div>
      {summary.selected.length > 0 && <div className="selected-travelers">{summary.selected.map((crow) => <span key={crow.id}>{crow.name}<small>Speed {effectiveTravelSpeed(crow)} · {carriedRations(crow)} rations</small></span>)}</div>}
      <div className="phase-section"><div><span className="section-number">02</span><div><h3>Choose a pace</h3><p>Pace establishes movement and both encounter numbers before the day's roles modify them.</p></div></div><div className="pace-preview" aria-label="Travel pace options"><article><span>Slow</span><strong>1 hex</strong><small>EN 8 · Role tests gain an edge</small></article><article className="suggested"><span>Normal</span><strong>2 hexes</strong><small>EN 7 · No pace modifier</small></article><article><span>Fast</span><strong>3 hexes</strong><small>EN 6 · Role tests take a bane</small></article></div></div>
      <footer><p>Pace and role assignment become interactive in the next slice.</p><button type="button" disabled>Continue to assignments <span>→</span></button></footer></section>
      <aside className="travel-map-panel"><header><div><p>Known world</p><h2>Cornath</h2></div><span>{journey.markerVisible ? "Position known" : "Party lost"}</span></header><TravelMap markerX={journey.markerX} markerY={journey.markerY} markerVisible={journey.markerVisible} onMarkerChange={(x, y) => updateMarker({ x, y })} onVisibilityChange={(visible) => updateMarker({ visible })} /></aside></div>
    <details className="travel-day-record"><summary><span>Today's record</span><small>No decisions recorded</small><i>⌄</i></summary><div><p>Pace, roles, resolved tests, encounter checks, interruptions, and Ref notes will collect here as the day unfolds.</p></div></details>
    <dialog className="party-dialog" ref={partyDialog} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}><header><div><p>Traveling today</p><h2>Choose the party</h2></div><button type="button" onClick={() => partyDialog.current?.close()}>Done</button></header><p>Only selected Crows affect this journey's Speed and rations. Registry status remains unchanged.</p><div>{characters.map((character) => <button className={memberIds.includes(character.id) ? "selected" : ""} type="button" onClick={() => toggleCharacter(character.id)} key={character.id}><span>{character.name}<small>{character.playerName ?? "Player not recorded"}</small></span><b>{memberIds.includes(character.id) ? "Traveling" : "Add"}</b></button>)}</div></dialog>
  </section>;
}
