"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { clampCoordinate, type ExpeditionCharacter, type ExpeditionMap, type MapToken } from "@/domain/expedition";
import { createClient } from "@/lib/supabase/client";

const EXPEDITION_ID = "00000000-0000-4000-8000-000000000101";

function tokenFromRow(row: Record<string, unknown>): MapToken {
  return {
    id: String(row.id),
    expeditionId: String(row.expedition_id),
    mapId: String(row.map_id),
    characterId: row.character_id ? String(row.character_id) : null,
    kind: row.kind === "player" ? "player" : "enemy",
    label: String(row.label),
    color: String(row.color),
    x: Number(row.x),
    y: Number(row.y),
  };
}

export function ExpeditionBoard({ maps, initialTokens, characters }: {
  maps: ExpeditionMap[];
  initialTokens: MapToken[];
  characters: ExpeditionCharacter[];
}) {
  const [supabase] = useState(() => createClient());
  const [activeMapId, setActiveMapId] = useState(maps[0]?.id ?? "");
  const [tokens, setTokens] = useState(initialTokens);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; pointerId: number } | null>(null);
  const activeMap = maps.find((map) => map.id === activeMapId) ?? maps[0];
  const activeTokens = tokens.filter((token) => token.mapId === activeMapId);
  const activeEnemies = activeTokens.filter((token) => token.kind === "enemy");

  function enemyNumber(token: MapToken): number {
    const recordedNumber = token.label.match(/^Enemy (\d+)$/)?.[1];
    return recordedNumber ? Number(recordedNumber) : activeEnemies.findIndex((enemy) => enemy.id === token.id) + 1;
  }

  function displayLabel(token: MapToken): string {
    return token.kind === "enemy" ? `Enemy ${enemyNumber(token)}` : token.label;
  }

  const refreshTokens = useCallback(async () => {
    const { data, error: refreshError } = await supabase
      .from("map_tokens")
      .select("id, expedition_id, map_id, character_id, kind, label, color, x, y")
      .eq("expedition_id", EXPEDITION_ID)
      .order("created_at");
    if (refreshError) return setError(refreshError.message);
    setTokens((data ?? []).map((row) => tokenFromRow(row)));
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("first-expedition-tokens")
      .on("postgres_changes", { event: "*", schema: "public", table: "map_tokens", filter: `expedition_id=eq.${EXPEDITION_ID}` }, refreshTokens)
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [refreshTokens, supabase]);

  function moveLocally(event: ReactPointerEvent<HTMLButtonElement>, tokenId: string) {
    if (!mapRef.current || dragRef.current?.id !== tokenId) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = clampCoordinate((event.clientX - rect.left) / rect.width);
    const y = clampCoordinate((event.clientY - rect.top) / rect.height);
    setTokens((current) => current.map((token) => token.id === tokenId ? { ...token, x, y } : token));
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>, tokenId: string) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: tokenId, pointerId: event.pointerId };
    setSelectedTokenId(tokenId);
    moveLocally(event, tokenId);
  }

  async function finishDrag(event: ReactPointerEvent<HTMLButtonElement>, tokenId: string) {
    if (dragRef.current?.id !== tokenId) return;
    moveLocally(event, tokenId);
    dragRef.current = null;
    const token = tokens.find((candidate) => candidate.id === tokenId);
    const rect = mapRef.current?.getBoundingClientRect();
    if (!token || !rect) return;
    const x = clampCoordinate((event.clientX - rect.left) / rect.width);
    const y = clampCoordinate((event.clientY - rect.top) / rect.height);
    const { error: updateError } = await supabase.from("map_tokens").update({ x, y, updated_at: new Date().toISOString() }).eq("id", tokenId);
    if (updateError) setError(updateError.message);
  }

  async function addCharacter(character: ExpeditionCharacter) {
    setError(null);
    const { error: addError } = await supabase.from("map_tokens").upsert({
      expedition_id: EXPEDITION_ID,
      map_id: activeMapId,
      character_id: character.id,
      kind: "player",
      label: character.name,
      color: character.color,
      x: 0.5,
      y: 0.5,
      updated_at: new Date().toISOString(),
    }, { onConflict: "expedition_id,character_id" });
    if (addError) setError(addError.message);
    else await refreshTokens();
  }

  async function addEnemy() {
    setError(null);
    const usedNumbers = activeEnemies.map((token) => enemyNumber(token));
    const nextEnemyNumber = Math.max(0, ...usedNumbers) + 1;
    const { error: addError } = await supabase.from("map_tokens").insert({
      expedition_id: EXPEDITION_ID,
      map_id: activeMapId,
      kind: "enemy",
      label: `Enemy ${nextEnemyNumber}`,
      color: "#d85050",
      x: 0.5,
      y: 0.5,
    });
    if (addError) setError(addError.message);
    else await refreshTokens();
  }

  async function removeSelected() {
    if (!selectedTokenId) return;
    const { error: removeError } = await supabase.from("map_tokens").delete().eq("id", selectedTokenId);
    if (removeError) setError(removeError.message);
    else {
      setSelectedTokenId(null);
      await refreshTokens();
    }
  }

  if (!activeMap) return <p className="map-empty">No expedition maps are configured.</p>;

  const selectedToken = tokens.find((token) => token.id === selectedTokenId);

  return (
    <div className="expedition-workspace">
      <div className="room-tabs" role="tablist" aria-label="Expedition rooms">
        {maps.map((map) => (
          <button className={map.id === activeMapId ? "active" : ""} role="tab" aria-selected={map.id === activeMapId} onClick={() => { setActiveMapId(map.id); setSelectedTokenId(null); }} key={map.id}>
            <span>{map.name}</span><small>{tokens.filter((token) => token.mapId === map.id).length} markers</small>
          </button>
        ))}
      </div>

      <div className="map-toolbar">
        <div className="crow-spawners"><span>Place a Crow</span>{characters.map((character) => <button style={{ "--token-color": character.color } as CSSProperties} onClick={() => addCharacter(character)} key={character.id}>{character.name}</button>)}</div>
        <button className="enemy-spawner" onClick={addEnemy}><b>+</b> Add numbered enemy</button>
      </div>

      {error && <p className="map-error" role="alert">Map update failed: {error}</p>}

      <div className="map-stage">
        <div className="battle-map" ref={mapRef} onPointerDown={(event) => { if (event.target === event.currentTarget) setSelectedTokenId(null); }}>
          {/* The supplied maps have individual aspect ratios; intrinsic sizing keeps their grids undistorted. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activeMap.imagePath} alt={`${activeMap.name} battle map`} draggable={false} />
          {activeTokens.map((token) => (
            <button
              className={`map-token ${token.kind} ${selectedTokenId === token.id ? "selected" : ""}`}
              style={{ left: `${token.x * 100}%`, top: `${token.y * 100}%`, "--token-color": token.color } as CSSProperties}
              aria-label={`${displayLabel(token)}. Drag to move.`}
              title={displayLabel(token)}
              onPointerDown={(event) => startDrag(event, token.id)}
              onPointerMove={(event) => moveLocally(event, token.id)}
              onPointerUp={(event) => void finishDrag(event, token.id)}
              onPointerCancel={() => { dragRef.current = null; }}
              key={token.id}
            >
              {token.kind === "enemy" ? enemyNumber(token) : token.label.slice(0, 2).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="selection-bar" aria-live="polite">
        {selectedToken ? <><span>Selected: <strong>{displayLabel(selectedToken)}</strong></span><button onClick={removeSelected}>Remove marker</button></> : <span>Select or drag a marker on the map.</span>}
      </div>
    </div>
  );
}
